import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { getTopVisibleFraction, scrollElementIntoFraction } from "../core/paneSync";
import { highlightLine } from "../core/highlightHtml";

export interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Line to highlight (0-based), or null. */
  activeLine: number | null;
  /** Bump this to scroll the active line into view (preview-driven jumps). */
  scrollNonce: number;
  /** Fired when the caret moves to a different line. */
  onCaretLine?: (line: number) => void;
  /** Fired on any scroll of the editor's own scroll container. */
  onScroll?: () => void;
}

export interface HtmlEditorHandle {
  /** Line index nearest the top of the viewport, and its fractional offset. */
  getTopLine: () => { line: number; fraction: number } | null;
  /** Scroll so `line` sits at `fraction` of the viewport height. */
  scrollToLine: (line: number, fraction: number) => void;
  isScrolledToBottom: () => boolean;
  scrollToBottom: () => void;
}

/**
 * Plain-textarea editor with a syntax-highlighted backdrop: the textarea's
 * text is transparent and a per-line highlighted copy renders underneath,
 * so both layers share identical font metrics and wrap the same way.
 *
 * The overlay is only shown while the textarea is unfocused. Some browsers
 * (observed in Firefox) fail to keep a fully-transparent, overlapping
 * textarea's native selection/drag rendering in sync with a sibling
 * element during an active text-selection drag, leaving the sibling's
 * content invisible until the window regains focus. Hiding the overlay
 * while focused removes the second layer entirely during interaction, so
 * there's nothing for the browser to get out of sync with.
 */
function HtmlEditor(
  { value, onChange, activeLine, scrollNonce, onCaretLine, onScroll }: HtmlEditorProps,
  ref: React.Ref<HtmlEditorHandle>
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lastCaretLine = useRef<number | null>(null);
  const [focused, setFocused] = useState(false);

  const lines = useMemo(() => value.split("\n"), [value]);
  const highlighted = useMemo(() => lines.map(highlightLine), [lines]);

  useEffect(() => {
    if (activeLine === null) return;
    const el = highlightRef.current?.children[activeLine];
    el?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollNonce]);

  useImperativeHandle(ref, () => ({
    getTopLine() {
      const container = scrollRef.current;
      const children = highlightRef.current?.children;
      if (!container || !children) return null;
      const top = getTopVisibleFraction(container, children);
      return top && { line: top.index, fraction: top.fraction };
    },
    scrollToLine(line, fraction) {
      const container = scrollRef.current;
      const el = highlightRef.current?.children[line];
      if (!container || !el) return;
      scrollElementIntoFraction(container, el, fraction);
    },
    isScrolledToBottom() {
      const container = scrollRef.current;
      return container !== null && container.scrollTop + container.clientHeight >= container.scrollHeight - 1;
    },
    scrollToBottom() {
      const container = scrollRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    },
  }));

  function reportCaret(ta: HTMLTextAreaElement) {
    const line = value.slice(0, ta.selectionStart).split("\n").length - 1;
    if (line !== lastCaretLine.current) {
      lastCaretLine.current = line;
      onCaretLine?.(line);
    }
  }

  return (
    <div className="editor-scroll" ref={scrollRef} onScroll={onScroll}>
      <div className="editor-stack">
        <div
          className={focused ? "editor-highlight is-editing" : "editor-highlight"}
          ref={highlightRef}
          aria-hidden="true"
        >
          {highlighted.map((html, i) => (
            <div
              key={i}
              className={i === activeLine ? "editor-line is-active" : "editor-line"}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
        </div>
        <textarea
          className={focused ? "editor-input is-editing" : "editor-input"}
          value={value}
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          onSelect={(e) => reportCaret(e.currentTarget)}
          onDragStart={(e) => e.preventDefault()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
    </div>
  );
}

export default forwardRef(HtmlEditor);
