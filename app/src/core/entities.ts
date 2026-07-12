/**
 * Named entities safe to decode to their literal Unicode character on
 * import, for readability in the raw HTML pane (curly quotes, dashes, etc.
 * read as prose soup otherwise).
 */
const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  bdquo: "„",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  copy: "©",
  trade: "™",
  reg: "®",
};

// " & < > — stay escaped no matter how they're spelled: the preview pane
// re-parses the source as HTML via innerHTML, and a literal <, >, or & in
// text content would corrupt that parse.
const PROTECTED_CODEPOINTS = new Set([34, 38, 60, 62]);

/**
 * Decode "typographic" HTML entities (smart quotes, dashes, nbsp, etc.)
 * into their literal Unicode characters. Leaves &amp; &lt; &gt; &quot;
 * &apos; — and any numeric entity resolving to one of those characters —
 * untouched, since they're structurally load-bearing for HTML.
 */
export function decodeTypographicEntities(html: string): string {
  return html.replace(
    /&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g,
    (match, body: string) => {
      if (body[0] === "#") {
        const isHex = body[1] === "x" || body[1] === "X";
        const code = parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10);
        if (Number.isNaN(code) || PROTECTED_CODEPOINTS.has(code)) return match;
        return String.fromCodePoint(code);
      }
      const name = body.toLowerCase();
      return name in NAMED_ENTITIES ? NAMED_ENTITIES[name]! : match;
    }
  );
}
