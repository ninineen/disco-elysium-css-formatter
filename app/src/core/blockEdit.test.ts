import {
  applyOutcome,
  applySkill,
  clearFormatting,
  parseBlock,
} from "./blockEdit";

const FORMATTED =
  '<p class="de-convo"><span class="de-skill logic">LOGIC </span> <span class="de-check success">[Easy: success]</span> — <em>It is a nervous tic.</em></p>';

describe("parseBlock", () => {
  it("reads skill, outcome and bracket from a formatted line", () => {
    expect(parseBlock(FORMATTED)).toEqual({
      skillCls: "logic",
      outcome: "success",
      hasBracket: true,
    });
  });

  it("returns nulls for a plain paragraph", () => {
    expect(parseBlock("<p>He says nothing.</p>")).toEqual({
      skillCls: null,
      outcome: null,
      hasBracket: false,
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
