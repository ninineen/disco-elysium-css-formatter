import {
  applyOutcome,
  applySkill,
  applyVoice,
  clearFormatting,
  parseBlock,
} from "./blockEdit";

const FORMATTED =
  '<p class="de-convo"><span class="de-skill logic">LOGIC </span> <span class="de-check success">[Easy: success]</span> — <em>It is a nervous tic.</em></p>';
const BENCH =
  '<p class="de-bench"><span class="de-voice lieutenant">THE LIEUTENANT</span> <span class="de-ruling">[Overruled]</span> — <em>We do not open files we cannot close.</em></p>';

describe("parseBlock", () => {
  it("reads skill, outcome and bracket from a formatted line", () => {
    expect(parseBlock(FORMATTED)).toEqual({
      skillCls: "logic",
      outcome: "success",
      hasBracket: true,
      voiceCls: null,
      isBench: false,
    });
  });

  it("returns nulls for a plain paragraph", () => {
    expect(parseBlock("<p>He says nothing.</p>")).toEqual({
      skillCls: null,
      outcome: null,
      hasBracket: false,
      voiceCls: null,
      isBench: false,
    });
  });

  it("reads the voice and flags a bench line", () => {
    expect(parseBlock(BENCH)).toEqual({
      skillCls: null,
      outcome: null,
      hasBracket: true,
      voiceCls: "lieutenant",
      isBench: true,
    });
  });
});

describe("applySkill", () => {
  it("replaces both the class and the label text of an existing skill span", () => {
    const out = applySkill(FORMATTED, "INLAND EMPIRE");
    expect(out).toContain('<span class="de-skill inland-empire">INLAND EMPIRE </span>');
    expect(out).not.toContain("LOGIC");
  });

  it("converts a <strong> label into a skill span", () => {
    const out = applySkill(
      "<p><strong>LOGIC</strong> [Easy: success] — body</p>",
      "VOLITION"
    );
    expect(out).toBe(
      '<p class="de-convo"><span class="de-skill volition">VOLITION</span> [Easy: success] — body</p>'
    );
  });

  it("wraps a plain uppercase leading label", () => {
    const out = applySkill("<p>HALF-LIGHT [Heroic: failure] — text</p>", "HALF-LIGHT");
    expect(out).toBe(
      '<p class="de-convo"><span class="de-skill half-light">HALF-LIGHT</span> [Heroic: failure] — text</p>'
    );
  });

  it("prepends a skill span when no label is found", () => {
    const out = applySkill("<p>Your hand clenches.</p>", "SHIVERS");
    expect(out).toBe(
      '<p class="de-convo"><span class="de-skill shivers">SHIVERS</span> Your hand clenches.</p>'
    );
  });

  it("keeps existing classes when adding de-convo", () => {
    const out = applySkill('<p class="fancy">LOGIC — hm</p>', "LOGIC");
    expect(out).toContain('<p class="de-convo fancy">');
  });
});

describe("applyOutcome", () => {
  it("rewrites class and bracket text, preserving the tier", () => {
    const out = applyOutcome(FORMATTED, "failure");
    expect(out).toContain('<span class="de-check failure">[Easy: Failure]</span>');
    expect(out).not.toContain("success");
  });

  it("wraps a plain bracket", () => {
    const out = applyOutcome("<p>LOGIC [Challenging: failure] — text</p>", "success");
    expect(out).toContain(
      '<span class="de-check success">[Challenging: Success]</span>'
    );
  });

  it("replaces a tierless bracket with the outcome word", () => {
    const out = applyOutcome("<p>LOGIC [—] — text</p>", "success");
    expect(out).toContain('<span class="de-check success">[Success]</span>');
  });

  it("leaves lines without brackets unchanged", () => {
    const line = "<p>He says nothing.</p>";
    expect(applyOutcome(line, "success")).toBe(line);
  });
});

describe("applyVoice", () => {
  it("replaces both the class and the label text of an existing voice span", () => {
    const out = applyVoice(BENCH, "THE BOY");
    expect(out).toContain('<span class="de-voice boy">THE BOY</span>');
    expect(out).toContain('class="de-bench"');
    expect(out).not.toContain("THE LIEUTENANT");
    expect(out).toContain("[Overruled]");
  });

  it("converts a <strong> bench label into a voice span", () => {
    const out = applyVoice("<p><strong>THE PARTNER</strong> [Entered] — body</p>", "THE PARTNER");
    expect(out).toBe(
      '<p class="de-bench"><span class="de-voice partner">THE PARTNER</span> [Entered] — body</p>'
    );
  });

  it("converts a skill line into a bench line, keeping the bracket as a ruling", () => {
    const out = applyVoice(FORMATTED, "THE PARTNER");
    expect(out).toContain('class="de-bench"');
    expect(out).toContain('<span class="de-voice partner">THE PARTNER </span>');
    expect(out).toContain('<span class="de-ruling">[Easy: success]</span>');
    expect(out).not.toContain("de-check");
    expect(out).not.toContain("de-convo");
  });
});

describe("clearFormatting — bench", () => {
  it("unwraps voice and ruling spans and drops de-bench", () => {
    expect(clearFormatting(BENCH)).toBe(
      "<p>THE LIEUTENANT [Overruled] — <em>We do not open files we cannot close.</em></p>"
    );
  });

  it("round-trips with applyVoice on a plain line", () => {
    const plain = "<p>THE PARTNER [Entered] — body</p>";
    expect(clearFormatting(applyVoice(plain, "THE PARTNER"))).toBe(plain);
  });
});

describe("clearFormatting", () => {

  it("unwraps spans and drops de-convo", () => {
    expect(clearFormatting(FORMATTED)).toBe(
      "<p>LOGIC  [Easy: success] — <em>It is a nervous tic.</em></p>"
    );
  });

  it("round-trips with applySkill on a plain line", () => {
    const plain = "<p>HALF-LIGHT [Heroic: failure] — text</p>";
    expect(clearFormatting(applySkill(plain, "HALF-LIGHT"))).toBe(plain);
  });
});
