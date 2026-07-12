import KofiLogo from "./KofiLogo";
import { FORMATTER_COPY } from "../features/formatter/copy";

const { footer } = FORMATTER_COPY;

export default function Footer() {
  return (
    <footer className="app-footer">
      <p className="footer-line">
        {footer.madeWith} <span aria-hidden="true">❤️</span> by{" "}
        <a href={footer.ninineenUrl} target="_blank" rel="noopener noreferrer">
          {footer.madeBy}
        </a>
      </p>
      <div className="footer-links">
        <a
          className="footer-kofi"
          href={footer.kofiUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={footer.kofiAriaLabel}
        >
          <KofiLogo height={22} />
        </a>
        <a
          className="footer-source"
          href={footer.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {footer.sourceCode}
        </a>
        <a
          className="footer-bug"
          href={footer.bugLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          🐛{footer.reportABug}
        </a>
      </div>
    </footer>
  );
}
