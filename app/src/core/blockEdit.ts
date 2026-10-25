import { findSkill, findBenchVoice, type BenchVoiceClass } from "./skills";

export type Outcome = "success" | "failure";

export interface BlockInfo {
  /** CSS class of the current de-skill span, or null if the line has none. */
  skillCls: string | null;
  /** Outcome of the current de-check span, or null if the line has none. */
  outcome: Outcome | null;
  /** Whether the line contains any [bracket] an outcome could attach to. */
  hasBracket: boolean;
  /** CSS class of the current de-voice span (Kim's bench), or null. */
  voiceCls: BenchVoiceClass | null;
  /** Whether the line is a Kim's-bench line (de-bench paragraph or de-voice span). */
  isBench: boolean;
}

const SKILL_SPAN_RE = /<span class="de-skill(?:\s+[\w-]+)?">([\s\S]*?)<\/span>/;
const CHECK_SPAN_RE = /<span class="de-check(?:\s+\w+)?">\[([\s\S]*?)\]<\/span>/;
const VOICE_SPAN_RE = /<span class="de-voice(?:\s+[\w-]+)?">([\s\S]*?)<\/span>/;
const BRACKET_RE = /\[([^\]]*)\]/;

export function parseBlock(line: string): BlockInfo {
  const skillCls = line.match(/class="de-skill\s+([\w-]+)"/)?.[1] ?? null;
  const outcomeMatch = line.match(/class="de-check\s+(success|failure)"/)?.[1];
  const outcome: Outcome | null =
    outcomeMatch === "success" || outcomeMatch === "failure" ? outcomeMatch : null;
  const voiceCls =
    (line.match(/class="de-voice\s+([\w-]+)"/)?.[1] as BenchVoiceClass | undefined) ?? null;
  const isBench = /\bde-bench\b/.test(line) || voiceCls !== null;
  return { skillCls, outcome, hasBracket: BRACKET_RE.test(line), voiceCls, isBench };
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

/** Add de-bench to the line's <p> class (no-op for non-<p> lines). */
function ensureBench(line: string): string {
  const open = line.match(/^(\s*)<p([^>]*)>/);
  if (!open) return line;
  const [, indentation, attrs = ""] = open;
  const classAttribute = attrs.match(/class="([^"]*)"/);

  if (!classAttribute) {
    return `${indentation}<p class="de-bench"${attrs}>${line.slice(open[0].length)}`;
  }

  const classNames = classAttribute[1] ?? "";
  if (/\bde-bench\b/.test(classNames)) return line;

  const newAttrs = attrs.replace(/class="([^"]*)"/, `class="de-bench $1"`);
  return `${indentation}<p${newAttrs}>${line.slice(open[0].length)}`;
}

/**
 * Set the line's bench voice: updates (or creates) the de-voice span AND
 * replaces the visible label text with the voice's canonical name, so
 * re-voicing a line as THE BOY also renames it. Converts de-skill spans and
 * de-convo paragraphs on the way through — a bench line is never a skill line.
 * Any de-check span becomes a de-ruling span with its bracket text unchanged
 * (rulings are free text, never Success/Failure).
 */
export function applyVoice(line: string, voiceName: string): string {
  const voice = findBenchVoice(voiceName);
  if (!voice) return line;
  const { className: cls, name: canonicalName } = voice;

  let out = line;

  const skillSpan = out.match(SKILL_SPAN_RE);
  const voiceSpan = out.match(VOICE_SPAN_RE);
  const span = skillSpan ?? voiceSpan;
  if (span) {
    const trailing = span[1]?.match(/\s*$/)?.[0] ?? "";
    out = out.replace(
      SKILL_SPAN_RE.test(out) ? SKILL_SPAN_RE : VOICE_SPAN_RE,
      `<span class="de-voice ${cls}">${canonicalName}${trailing}</span>`
    );
  } else {
    const strong = out.match(/^(\s*<p[^>]*>)<strong>[\s\S]*?<\/strong>/);
    if (strong) {
      out = out.replace(
        strong[0],
        `${strong[1]}<span class="de-voice ${cls}">${canonicalName}</span>`
      );
    } else {
      const open = out.match(/^(\s*)<([a-zA-Z][\w-]*)((?:\s[^>]*)?)>/);
      if (!open) return line;
      const head = open[0];
      const rest = out.slice(head.length);
      // Plain uppercase label at the start of the paragraph (e.g. "THE BOY [Standing ...")
      const label = rest.match(/^[A-Z][A-Z()\- ]*[A-Z)](?=\s*(\[|â€"|&mdash;))/);
      const body = label ? rest.slice(label[0].length) : ` ${rest}`;
      out = `${head}<span class="de-voice ${cls}">${canonicalName}</span>${body}`;
    }
  }

  // Swap de-convo for de-bench, then make sure the class is there at all.
  out = out.replace(/^(\s*)<p class="de-convo"/, `$1<p class="de-bench"`);
  out = ensureBench(out);

  // Rulings are free text: keep whatever is inside the brackets.
  out = out.replace(
    CHECK_SPAN_RE,
    (_m, inner: string) => `<span class="de-ruling">[${inner}]</span>`
  );
  return out;
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

/** Unwrap de-skill/de-check/de-voice/de-ruling spans and drop the de-convo/de-bench class. */
export function clearFormatting(line: string): string {
  let out = line
    .replace(/<span class="de-skill[^"]*">([\s\S]*?)<\/span>/g, "$1")
    .replace(/<span class="de-check[^"]*">([\s\S]*?)<\/span>/g, "$1")
    .replace(/<span class="de-voice[^"]*">([\s\S]*?)<\/span>/g, "$1")
    .replace(/<span class="de-ruling[^"]*">([\s\S]*?)<\/span>/g, "$1");
  out = out.replace(/^(\s*)<p class="de-convo"([^>]*)>/, "$1<p$2>");
  out = out.replace(
    /^(\s*)<p class="de-convo ([^"]*)"/,
    `$1<p class="$2"`
  );
  out = out.replace(/^(\s*)<p class="de-bench"([^>]*)>/, "$1<p$2>");
  out = out.replace(
    /^(\s*)<p class="de-bench ([^"]*)"/,
    `$1<p class="$2"`
  );
  return out;
}
