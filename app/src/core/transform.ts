import { findSkill, type SkillClass } from "./skills";
import { decodeTypographicEntities } from "./entities";

/**
 * Given the raw skill label from inside <strong>â€¦</strong>, return the CSS
 * class, or null if the label is not a recognised skill name.
 * Sub-skills like "PERCEPTION (HEARING)" map to "perception".
 */
export function skillClass(label: string): SkillClass | null {
  const base = label.replace(/\s*\(.*\)$/, "").trim();
  return findSkill(base)?.className ?? null;
}

/**
 * Determine success/failure class from the bracket content.
 * Returns "success" | "failure" | null (for [â€”] or unrecognised).
 */
export function checkClass(bracketInner: string): "success" | "failure" | null {
  if (bracketInner === "â€”") return null;
  if (/:\s*(critical\s+)?success/i.test(bracketInner)) return "success";
  if (/:\s*failure/i.test(bracketInner)) return "failure";
  return null;
}

/**
 * Attempt to transform a single line. Returns the transformed string, or the
 * original line unchanged if it doesn't match the exact skill-check pattern.
 *
 * Input pattern (single line):
 *   <p><strong>SKILL NAME</strong> [bracket] optional mood tag â€” body</p>
 *   <p><strong>SKILL NAME</strong> [â€”]</p>   â† stub: no body
 *
 * Output:
 *   <p class="de-convo"><span class="de-skill cls">SKILL NAME</span>
 *   <span class="de-check success|failure">[bracket]</span> mood â€” body</p>
 */
export function transformLine(line: string): string {
  const skillMatch = line.match(
    /^<p>(<strong>(.+?)<\/strong>)([\s\S]*)(<\/p>)$/
  );
  if (!skillMatch) return line;

  const rawLabel = skillMatch[2];
  const rest = skillMatch[3];
  const closeTag = skillMatch[4];
  if (rawLabel === undefined || rest === undefined || closeTag === undefined) {
    return line;
  }
  const cls = skillClass(rawLabel);
  if (!cls) return line; // bold prose, not a skill check

  const trimmedRest = rest.trimStart();
  if (!trimmedRest) return line;

  const bracketStart = trimmedRest.indexOf("[");
  if (bracketStart !== 0) return line;

  const bracketEnd = trimmedRest.indexOf("]");
  if (bracketEnd === -1) return line;

  const rawBracket = trimmedRest.slice(1, bracketEnd);
  const trimmedBracket = rawBracket.trim();

  const afterBracket = trimmedRest.slice(bracketEnd + 1);

  const chkCls = checkClass(trimmedBracket);

  let checkPart: string;
  if (chkCls) {
    checkPart = `<span class="de-check ${chkCls}">[${trimmedBracket}]</span>`;
  } else {
    checkPart = `[${trimmedBracket}]`;
  }

  const sepIdx = afterBracket.indexOf(" â€” ");
  let moodPart = "";
  let bodyPart = "";

  if (sepIdx === -1) {
    moodPart = afterBracket;
    bodyPart = "";
  } else {
    moodPart = afterBracket.slice(0, sepIdx);
    bodyPart = afterBracket.slice(sepIdx);
  }

  const skillSpan = `<span class="de-skill ${cls}">${rawLabel}</span>`;
  const body = bodyPart;

  return `<p class="de-convo">${skillSpan} ${checkPart}${moodPart}${body}${closeTag}`;
}

/**
 * Run transformLine() over every line of a full HTML document, after
 * decoding typographic entities (smart quotes, dashes, etc.) so the raw
 * HTML pane reads as prose rather than entity soup.
 */
export function transformDocument(html: string): string {
  return decodeTypographicEntities(html).split("\n").map(transformLine).join("\n");
}
