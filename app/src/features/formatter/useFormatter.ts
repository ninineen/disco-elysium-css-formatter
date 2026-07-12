import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import type { HtmlEditorHandle } from "../../components/HtmlEditor";
import {
  applyOutcome,
  applySkill,
  clearFormatting,
  parseBlock,
  type Outcome,
} from "../../core/blockEdit";
import {
  getTopVisibleFraction,
  nearestBlockIndex,
  scrollElementIntoFraction,
} from "../../core/paneSync";
import { transformDocument } from "../../core/transform";
import { copyText } from "./copyText";

interface MenuPosition {
  x: number;
  y: number;
}
type CopyStatus = "idle" | "success" | "error";

const MENU_DIMENSIONS = { width: 240, height: 420 } as const;
const SCROLL_SYNC_RELEASE_DELAY_MS = 150;

type Pane = "source" | "preview";
type LineUpdate = (line: string) => string;

export function useFormatter() {
  const [htmlSource, setHtmlSource] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [menu, setMenu] = useState<MenuPosition | null>(null);
  const [editorScrollNonce, setEditorScrollNonce] = useState(0);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyStatusTimeout = useRef<number | undefined>(undefined);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewOuterRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HtmlEditorHandle>(null);
  const drivingPane = useRef<Pane | null>(null);
  const driveTimeout = useRef<number | undefined>(undefined);

  const lines = useMemo(() => (htmlSource ?? "").split("\n"), [htmlSource]);
  const blockLines = useMemo(() => findBlockLines(lines), [lines]);
  const menuInfo = useMemo(() => {
    if (activeLine === null) return null;
    const line = lines[activeLine];
    return line === undefined ? null : parseBlock(line);
  }, [activeLine, lines]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || htmlSource === null) return;

    preview.innerHTML = htmlSource;
    Array.from(preview.children).forEach((child, index) => {
      child.classList.toggle("active-block", blockLines[index] === activeLine);
    });
  }, [activeLine, blockLines, htmlSource]);

  function loadFile(text: string) {
    setHtmlSource(transformDocument(text));
    setActiveLine(null);
    setMenu(null);
  }

  function reset() {
    setHtmlSource(null);
    setActiveLine(null);
    setMenu(null);
    setCopyStatus("idle");
  }

  function handlePreviewClick(event: MouseEvent<HTMLDivElement>) {
    const preview = previewRef.current;
    const target = event.target;
    if (!preview || !(target instanceof Element)) return;

    const block = getDirectPreviewChild(preview, target);
    if (!block) {
      setMenu(null);
      setActiveLine(null);
      return;
    }

    const previewIndex = Array.from(preview.children).indexOf(block);
    const lineIndex = blockLines[previewIndex];
    if (lineIndex === undefined) return;

    setActiveLine(lineIndex);
    setEditorScrollNonce((nonce) => nonce + 1);
    setMenu(getMenuPosition(event.clientX, block.getBoundingClientRect().bottom));
  }

  function handleCaretLine(line: number) {
    if (menu) return;
    setActiveLine(line);
    const previewIndex = blockLines.indexOf(line);
    if (previewIndex === -1) return;
    previewRef.current?.children[previewIndex]?.scrollIntoView({ block: "nearest" });
  }

  function handleEditorChange(value: string) {
    setHtmlSource(value);
    setMenu(null);
    const lineCount = value.split("\n").length;
    setActiveLine((line) => (line !== null && line >= lineCount ? null : line));
  }

  function handleEditorScroll() {
    if (drivingPane.current === "preview") return;
    markDrivingPane("source");

    const topLine = editorRef.current?.getTopLine();
    const previewOuter = previewOuterRef.current;
    if (!topLine || !previewOuter) return;

    if (editorRef.current?.isScrolledToBottom()) {
      previewOuter.scrollTop = previewOuter.scrollHeight;
      return;
    }

    const previewIndex = nearestBlockIndex(blockLines, topLine.line);
    const previewChild = previewRef.current?.children[previewIndex];
    if (!previewChild) return;
    scrollElementIntoFraction(previewOuter, previewChild, topLine.fraction);
  }

  function handlePreviewScroll() {
    if (drivingPane.current === "source") return;
    markDrivingPane("preview");

    const previewOuter = previewOuterRef.current;
    const previewChildren = previewRef.current?.children;
    if (!previewOuter || !previewChildren) return;

    if (isScrolledToBottom(previewOuter)) {
      editorRef.current?.scrollToBottom();
      return;
    }

    const top = getTopVisibleFraction(previewOuter, previewChildren);
    if (!top) return;

    const lineIndex = blockLines[top.index];
    if (lineIndex !== undefined) editorRef.current?.scrollToLine(lineIndex, top.fraction);
  }

  function markDrivingPane(pane: Pane) {
    drivingPane.current = pane;
    window.clearTimeout(driveTimeout.current);
    driveTimeout.current = window.setTimeout(() => {
      drivingPane.current = null;
    }, SCROLL_SYNC_RELEASE_DELAY_MS);
  }

  function updateActiveLine(update: LineUpdate) {
    if (htmlSource === null || activeLine === null) return;
    const currentLine = lines[activeLine];
    if (currentLine === undefined) return;

    const nextLines = [...lines];
    nextLines[activeLine] = update(currentLine);
    setHtmlSource(nextLines.join("\n"));
    setMenu(null);
  }

  async function copyHtml() {
    if (htmlSource === null) return;

    const didCopy = await copyText(htmlSource);
    setCopyStatus(didCopy ? "success" : "error");
    window.clearTimeout(copyStatusTimeout.current);
    copyStatusTimeout.current = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2500);
  }

  return {
    htmlSource,
    activeLine,
    menu,
    menuInfo,
    copyStatus,
    editorScrollNonce,
    editorRef,
    previewRef,
    previewOuterRef,
    loadFile,
    reset,
    copyHtml,
    closeMenu: () => setMenu(null),
    clearActiveLine: () => updateActiveLine(clearFormatting),
    setActiveSkill: (skill: string) => updateActiveLine((line) => applySkill(line, skill)),
    setActiveOutcome: (outcome: Outcome) => updateActiveLine((line) => applyOutcome(line, outcome)),
    handlePreviewClick,
    handleCaretLine,
    handleEditorChange,
    handleEditorScroll,
    handlePreviewScroll,
  };
}

function findBlockLines(lines: string[]): number[] {
  return lines.flatMap((line, index) => (/^\s*</.test(line) ? [index] : []));
}

function getDirectPreviewChild(root: HTMLElement, target: Element): Element | null {
  let node: Element | null = target;
  while (node && node.parentElement !== root) node = node.parentElement;
  return node;
}

function getMenuPosition(clickX: number, blockBottom: number): MenuPosition {
  return {
    x: Math.max(8, Math.min(clickX, window.innerWidth - MENU_DIMENSIONS.width)),
    y: Math.max(8, Math.min(blockBottom + 6, window.innerHeight - MENU_DIMENSIONS.height)),
  };
}
function isScrolledToBottom(container: HTMLElement): boolean {
  return container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
}
