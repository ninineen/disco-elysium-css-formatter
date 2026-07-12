import { decodeTypographicEntities } from "./entities";

describe("decodeTypographicEntities", () => {
  it("decodes smart quotes, dashes, and nbsp to literal characters", () => {
    expect(
      decodeTypographicEntities(
        "&ldquo;Detective Du Bois,&rdquo; Kim&rsquo;s voice&nbsp;crackles &mdash; sharp."
      )
    ).toBe("“Detective Du Bois,” Kim’s voice crackles — sharp.");
  });

  it("decodes hex and decimal numeric entities", () => {
    expect(decodeTypographicEntities("&#8217;&#x2019;")).toBe("’’");
  });

  it("leaves amp, lt, gt, and quot untouched", () => {
    const s = "Fish &amp; Chips &lt;p&gt; &quot;quoted&quot;";
    expect(decodeTypographicEntities(s)).toBe(s);
  });

  it("leaves numeric entities for protected codepoints untouched", () => {
    const s = "&#34;&#38;&#60;&#62;&#x3C;&#x3E;";
    expect(decodeTypographicEntities(s)).toBe(s);
  });

  it("leaves unknown named entities untouched", () => {
    expect(decodeTypographicEntities("&madeup;")).toBe("&madeup;");
  });
});
