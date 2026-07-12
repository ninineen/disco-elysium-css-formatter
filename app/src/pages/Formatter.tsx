import BlockMenu from "../components/BlockMenu";
import type { Outcome } from "../core/blockEdit";
import FormatterLanding from "../features/formatter/FormatterLanding";
import FormatterWorkspace from "../features/formatter/FormatterWorkspace";
import { fetchSampleDocument } from "../features/formatter/sampleDocument";
import { useFormatter } from "../features/formatter/useFormatter";

export interface FormatterProps {
  onOpenGuide: () => void;
}

export default function Formatter({ onOpenGuide }: FormatterProps) {
  const formatter = useFormatter();

  async function loadSample() {
    const sampleDocument = await fetchSampleDocument();
    formatter.loadFile(sampleDocument);
  }

  if (formatter.htmlSource === null) {
    return (
      <FormatterLanding
        onFile={formatter.loadFile}
        onOpenGuide={onOpenGuide}
        onTrySample={() => void loadSample()}
      />
    );
  }

  return (
    <>
      <FormatterWorkspace
        htmlSource={formatter.htmlSource}
        activeLine={formatter.activeLine}
        copyStatus={formatter.copyStatus}
        editorScrollNonce={formatter.editorScrollNonce}
        editorRef={formatter.editorRef}
        previewRef={formatter.previewRef}
        previewOuterRef={formatter.previewOuterRef}
        onReset={formatter.reset}
        onCopy={formatter.copyHtml}
        onEditorChange={formatter.handleEditorChange}
        onCaretLine={formatter.handleCaretLine}
        onEditorScroll={formatter.handleEditorScroll}
        onPreviewScroll={formatter.handlePreviewScroll}
        onPreviewClick={formatter.handlePreviewClick}
      />
      {formatter.menu && formatter.menuInfo && (
        <BlockMenu
          x={formatter.menu.x}
          y={formatter.menu.y}
          info={formatter.menuInfo}
          onPickSkill={formatter.setActiveSkill}
          onPickOutcome={(outcome: Outcome) => formatter.setActiveOutcome(outcome)}
          onClear={formatter.clearActiveLine}
          onClose={formatter.closeMenu}
        />
      )}
    </>
  );
}