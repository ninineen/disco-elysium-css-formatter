import { findSkill } from "./skills";

export type Outcome = "success" | "failure";

export interface BlockInfo {
  /** CSS class of the current de-skill span, or null if the line has none. */
  skillCls: string | null;
  /** Outcome of the current de-check span, or null if the line has none. */
  outcome: Outcome | null;
  /** Whether the line contains any [bracket] an outcome could attach to. */
  hasBracket: boolean;
}

const SKILL_SPAN_RE = /<span class="de-skill(?:\s+[\w-]+)?">([\s\S]*?)<\/span>/;
const CHECK_SPAN_RE = /<span class="de-check(?:\s+\w+)?">\[([\s\S]*?)\]<\/span>/;
const BRACKET_RE = /\[([^\]]*)\]/;

export function parseBlock(line: string): BlockInfo {
  const skillCls = line.match(/class="de-skill\s+([\w-]+)"/)?.[1] ?? null;
  const outcomeMatch = line.match(/class="de-check\s+(success|failure)"/)?.[1];
  const outcome: Outcome | null =
    outcomeMatch === "success" || outcomeMatch === "failure" ? outcomeMatch : null;
  return { skillCls, outcome, hasBracket: BRACKET_RE.test(line) };
}

/** Add de-convo to the line's <p> class (no-op for non-<p> lines). */
function ensureConvo(line: string): string {
  const open = line.match(/^(\s*)<p([^>]*)>/);
  if (!open) return line;
  const [, indentation, attrs = ""] = open;
  const classAttribute = attrs.match(/class="([^"]*)"/);

  if (!classAttribute) {
    return `${indentation}<p class="de-convo"${attrs}>${line.slice(open[0].length)}`;
  }

  const classNames = classAttribute[1] ?? "";
  if (/\bde-convo\b/.test(classNames)) return line;

  const newAttrs = attrs.replace(/class="([^"]*)"/, `class="de-convo $1"`);
  return `${indentation}<p${newAttrs}>${line.slice(open[0].length)}`;
}

/**
 * Set the line's skill: updates (or creates) the de-skill span AND replaces
 * the visible label text with the skill's canonical name, so recoloring a
 * LOGIC line as INLAND EMPIRE also renames it.
 */
export function applySkill(line: string, skillName: string): string {
  const skill = findSkill(skillName);
  if (!skill) return line;
  const { className: cls, name: canonicalName } = skill;

  const span = line.match(SKILL_SPAN_RE);
  if (span) {
    const spanContents = span[1] ?? "";
    const trailing = spanContents.match(/\s*$/)?.[0] ?? "";
    return ensureConvo(
      line.replace(
        SKILL_SPAN_RE,
        `<span class="de-skill ${cls}">${canonicalName}${trailing}</span>`
      )
    );
  }

  const strong = line.match(/^(\s*<p[^>]*>)<strong>[\s\S]*?<\/strong>/);
  if (strong) {
    return ensureConvo(
      line.replace(
        strong[0],
        `${strong[1]}<span class="de-skill ${cls}">${canonicalName}</span>`
      )
    );
  }

  const open = line.match(/^(\s*)<([a-zA-Z][\w-]*)((?:\s[^>]*)?)>/);
  if (!open) return line;
  const head = open[0];
  const rest = line.slice(head.length);
  // Plain uppercase label at the start of the paragraph (e.g. "LOGIC [Easy: ...")
  const label = rest.match(/^[A-Z][A-Z()\- ]*[A-Z)](?=\s*(\[|â€”|&mdash;))/);
  const body = label ? rest.slice(label[0].length) : ` ${rest}`;
  return ensureConvo(
    `${head}<span class="de-skill ${cls}">${canonicalName}</span>${body}`
  );
}

/**
 * Set the line's check outcome: updates (or creates) the de-check span AND
 * rewrites the bracket text ([Trivial: Success] -> [Trivial: Failure]),
 * preserving the tier before the colon.
 */
export function applyOutcome(line: string, outcome: Outcome): string {
  const word = outcome === "success" ? "Success" : "Failure";
  const rewriteInner = (inner: string) => {
    const colon = inner.indexOf(":");
    return colon === -1 ? word : `${inner.slice(0, colon)}: ${word}`;
  };

  if (CHECK_SPAN_RE.test(line)) {
    return line.replace(
      CHECK_SPAN_RE,
      (_m, inner: string) =>
        `<span class="de-check ${outcome}">[${rewriteInner(inner)}]</span>`
    );
  }
  const bracket = line.match(BRACKET_RE);
  if (bracket) {
    const bracketContents = bracket[1] ?? "";
    return line.replace(
      bracket[0],
      `<span class="de-check ${outcome}">[${rewriteInner(bracketContents)}]</span>`
    );
  }
  return line;
}

/** Unwrap de-skill/de-check spans and drop the de-convo class. */
export function clearFormatting(line: string): string {
  let out = line
    .replace(/<span class="de-skill[^"]*">([\s\S]*?)<\/span>/g, "$1")
    .replace(/<span class="de-check[^"]*">([\s\S]*?)<\/span>/g, "$1");
  out = out.replace(/^(\s*)<p class="de-convo"([^>]*)>/, "$1<p$2>");
  out = out.replace(
    /^(\s*)<p class="de-convo ([^"]*)"/,
    `$1<p class="$2"`
  );
  return out;
}
