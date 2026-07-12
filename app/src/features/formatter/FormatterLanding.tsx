import { CheckIcon, DesktopIcon, LockIcon } from "../../components/icons";
import UploadBox from "../../components/UploadBox";
import { EXAMPLE_INPUT, EXAMPLE_OUTPUT } from "../../core/guideExample";
import { highlightHtml } from "../../core/highlightHtml";
import { FORMATTER_COPY, FORMATTER_LINKS } from "./copy";

interface FormatterLandingProps {
  onFile: (text: string) => void;
  onOpenGuide: () => void;
  onTrySample: () => void;
}

export default function FormatterLanding({
  onFile,
  onOpenGuide,
  onTrySample,
}: FormatterLandingProps) {
  const copy = FORMATTER_COPY.intro;

  return (
    <div className="formatter-empty">
      <div className="home">
        <section className="home-intro">
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <div className="home-links">

            <a
              className="home-link"
              href={FORMATTER_LINKS.workskinGuide}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.guideLink}
            </a>
            <button className="home-link home-link-btn" onClick={onOpenGuide}>
              {copy.rulesLink}
            </button>
          </div>
        </section>

        <section className="home-demo-card" aria-label="Formatter example">
          <div className="home-before-after">
            <CodeExample label={copy.inputLabel} source={EXAMPLE_INPUT} />
            <DemoArrow />
            <CodeExample label={copy.outputLabel} source={EXAMPLE_OUTPUT} />
            <DemoArrow />
            <RenderedExample label={copy.previewLabel} html={EXAMPLE_OUTPUT} />
          </div>
        </section>

        <aside className="home-protip" aria-label="Formatting pro tip">
          <span className="home-protip-sparkle" aria-hidden="true">{"\u2726"}</span>
          <p><strong>Pro tip:</strong> Paste your rich text into the AO3 Chapter/New Work editor, then switch to HTML mode. It is the quickest way to turn your rich-text chapter into clean HTML that this tool likes :3</p>
        </aside>

        <section className="home-upload-section">
          <button className="btn btn-primary home-sample-button" onClick={onTrySample}>
            {copy.trySample}
          </button>
          <div className="home-upload-divider" aria-hidden="true">or</div>
          <UploadBox onFile={onFile} />
          <div className="home-badges">
            <span className="home-badge"><LockIcon />{copy.privacyNote}</span>
            <span className="home-badge"><CheckIcon />{copy.validationNote}</span>
            <span className="home-badge"><DesktopIcon />{copy.desktopNote}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

function CodeExample({ label, source }: { label: string; source: string }) {
  return (
    <div className="home-before-after-col">
      <div className="home-before-after-label">{label}</div>
      <pre className="guide-code" dangerouslySetInnerHTML={{ __html: highlightHtml(source) }} />
    </div>
  );
}

function RenderedExample({ label, html }: { label: string; html: string }) {
  return (
    <div className="home-before-after-col">
      <div className="home-before-after-label">{label}</div>
      <div id="workskin">
        <div className="userstuff home-before-after-preview" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

function DemoArrow() {
  return <div className="home-before-after-arrow" aria-hidden="true">{"\u2192"}</div>;
}