import type { MouseEvent, RefObject } from "react";
import HtmlEditor, { type HtmlEditorHandle } from "../../components/HtmlEditor";
import { FORMATTER_COPY } from "./copy";

interface FormatterWorkspaceProps {
  htmlSource: string;
  activeLine: number | null;
  copyStatus: "idle" | "success" | "error";
  editorScrollNonce: number;
  editorRef: RefObject<HtmlEditorHandle | null>;
  previewRef: RefObject<HTMLDivElement | null>;
  previewOuterRef: RefObject<HTMLDivElement | null>;
  onReset: () => void;
  onCopy: () => void;
  onEditorChange: (value: string) => void;
  onCaretLine: (line: number) => void;
  onEditorScroll: () => void;
  onPreviewScroll: () => void;
  onPreviewClick: (event: MouseEvent<HTMLDivElement>) => void;
}

export default function FormatterWorkspace({
  htmlSource,
  activeLine,
  copyStatus,
  editorScrollNonce,
  editorRef,
  previewRef,
  previewOuterRef,
  onReset,
  onCopy,
  onEditorChange,
  onCaretLine,
  onEditorScroll,
  onPreviewScroll,
  onPreviewClick,
}: FormatterWorkspaceProps) {
  const copy = FORMATTER_COPY;

  return (
    <div className="formatter">
      <div className="formatter-toolbar">
        <button className="btn" onClick={onReset}>{copy.toolbar.startOver}</button>
        <button className="btn btn-primary" onClick={onCopy}>
          {copyStatus === "success"
            ? copy.toolbar.copied
            : copyStatus === "error"
              ? copy.toolbar.copyFailed
              : copy.toolbar.copy}
        </button>
      </div>

      <div className="formatter-panes">
        <section className="pane">
          <div className="pane-label">{copy.panes.source}</div>
          <HtmlEditor
            ref={editorRef}
            value={htmlSource}
            onChange={onEditorChange}
            activeLine={activeLine}
            scrollNonce={editorScrollNonce}
            onCaretLine={onCaretLine}
            onScroll={onEditorScroll}
          />
        </section>

        <section className="pane">
          <div className="pane-label">{copy.panes.preview}</div>
          <div
            id="workskin"
            className="preview-pane-outer"
            ref={previewOuterRef}
            onScroll={onPreviewScroll}
          >
            <div ref={previewRef} className="userstuff preview-pane" onClick={onPreviewClick} />
          </div>
        </section>
      </div>
    </div>
  );
}