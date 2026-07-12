export const FORMATTER_COPY = {
  intro: {
    title: "Color your Disco Elysium-style skill checks for AO3",
    description: "Drop in your chapter's HTML and skill checks get auto-colored to match the workskin.",
    trySample: "Try a sample",
    guideLink: "New to the workskin? Read the CSS guide on AO3 ↗",
    rulesLink: "See this tool's formatting rules →",
    inputLabel: "Your HTML",
    outputLabel: "Automatically adds classes ✨",
    previewLabel: "How it renders",
    privacyNote: "Runs entirely in your browser nothing is uploaded",
    validationNote: "Make sure your HTML is well-formed first (every tag closed)",
  },
  toolbar: {
    startOver: "← Start over",
    copy: "Copy AO3 HTML",
    copied: "Copied!",
    copyFailed: "Copy failed — select text manually",
  },
  panes: {
    source: "HTML source (Scroll here)",
    preview: "Preview. Click a line to set its skill or check result",
  },
  footer: {
    sourceCode: 'Source code on GitHub. Nothing sketchy, promise',
    reportABug: 'Report a bug',
    bugLink: 'https://github.com/ninineen/disco-elysium-css-formatter/issues/new',
    madeWith: "Made with",
    madeBy: "NiniNeen",
    ninineenUrl: "https://www.ninineen.com",
    kofiUrl: "https://ko-fi.com/ninineen",
    kofiAriaLabel: "Buy me a coffee on Ko-fi",
    sourceUrl: "https://github.com/ninineen/disco-elysium-css-formatter",
  }
} as const;

export const FORMATTER_LINKS = {
  workskinGuide: "https://archiveofourown.org/works/86984576/chapters/230306496",
} as const;