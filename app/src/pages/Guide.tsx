import { EXAMPLE_INPUT, EXAMPLE_OUTPUT } from "../core/guideExample";

export default function Guide() {
  return (
    <div className="guide">
      <h2>How to format your chapter</h2>
      <p>
        The formatter looks for one exact line shape. Anything that matches
        it gets auto-colored on upload; anything that doesn't is left as
        plain text for you to fix by hand in the preview.
      </p>
      <p>
        On upload, typographic entities (<code>&amp;ldquo;</code>,{" "}
        <code>&amp;mdash;</code>, <code>&amp;nbsp;</code>, etc.) are decoded
        to their literal characters (“, —, a plain space) so the HTML pane
        reads as prose instead of entity soup. <code>&amp;amp;</code>,{" "}
        <code>&amp;lt;</code>, <code>&amp;gt;</code>, and{" "}
        <code>&amp;quot;</code> are left alone since those are structural.
      </p>

      <h3>The shape it recognizes</h3>
      <pre className="guide-code">
        {"<p><strong>SKILL NAME</strong> [Tier: Outcome] — body text</p>"}
      </pre>
      <ul className="guide-list">
        <li>The skill name must be wrapped in <code>&lt;strong&gt;</code> and spelled exactly (e.g. <code>VOLITION</code>, <code>INLAND EMPIRE</code>, <code>HALF-LIGHT</code>).</li>
        <li>The bracket must immediately follow the skill name, and contain <code>Success</code>, <code>Critical Success</code>, or <code>Failure</code> to be colored — otherwise it's left as plain <code>[—]</code> text.</li>
        <li>The whole skill check must be on a single line, as one paragraph.</li>
      </ul>

      <h3>Worked example</h3>
      <p>Input:</p>
      <pre className="guide-code">{EXAMPLE_INPUT}</pre>
      <p>Auto-parsed output:</p>
      <pre className="guide-code">{EXAMPLE_OUTPUT}</pre>

      <h3>If a line doesn't get picked up</h3>
      <p>
        That's expected for anything outside the exact shape above — an
        unbolded skill name, a missing separator, a custom label. Click the
        line in the preview pane: a menu appears showing its current skill
        and check result. Picking a skill colors the line <em>and</em>
        renames its label to that skill; picking Success/Failure recolors
        the check <em>and</em> rewrites the bracket text to match. Clicking
        a line also highlights it in the HTML pane, so you can find and edit
        the exact source line. For anything beyond skill checks (speakers,
        alerts, choices, etc.), edit the HTML pane directly.
      </p>
    </div>
  );
}
