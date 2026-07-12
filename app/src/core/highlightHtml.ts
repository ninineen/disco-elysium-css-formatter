function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightTag(tag: string): string {
  const m = tag.match(/^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)$/);
  if (!m) return `<span class="tok-tag">${escapeHtml(tag)}</span>`;
  const [, open = "", name = "", attrs = "", close = ""] = m;
  const attrsHtml = attrs.replace(
    /([\w-]+)(=(?:"[^"]*"|'[^']*'))?/g,
    (_a, attrName: string, attrVal?: string) => {
      const val = attrVal
        ? `<span class="tok-punct">=</span><span class="tok-string">${escapeHtml(attrVal.slice(1))}</span>`
        : "";
      return `<span class="tok-attr">${escapeHtml(attrName)}</span>${val}`;
    }
  );
  return (
    `<span class="tok-punct">${escapeHtml(open)}</span>` +
    `<span class="tok-tag">${name}</span>` +
    attrsHtml +
    `<span class="tok-punct">${escapeHtml(close)}</span>`
  );
}

/** Regex-based HTML syntax highlighting for one source line. */
export function highlightLine(line: string): string {
  if (line === "") return "&#8203;";
  const out: string[] = [];
  const re = /<\/?[a-zA-Z][^>]*>|&[a-zA-Z][a-zA-Z0-9]*;|&#x?[0-9a-fA-F]+;/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(escapeHtml(line.slice(last, m.index)));
    const tok = m[0];
    if (tok.startsWith("<")) {
      out.push(highlightTag(tok));
    } else {
      out.push(`<span class="tok-entity">${escapeHtml(tok)}</span>`);
    }
    last = m.index + tok.length;
  }
  if (last < line.length) out.push(escapeHtml(line.slice(last)));
  return out.join("");
}

/** Syntax-highlight a multi-line HTML string, one <span> run of markup per line. */
export function highlightHtml(source: string): string {
  return source.split("\n").map(highlightLine).join("\n");
}
