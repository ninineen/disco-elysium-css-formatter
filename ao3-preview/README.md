# AO3 Chapter Previewer

Local preview for formatted chapters. Renders them inside the real AO3 stylesheet + the Disco Elysium workskin so what you see matches what AO3 shows.

---

## Setup

1. Open VS Code **from inside WSL** — in your Ubuntu terminal:
   ```bash
   cd /home/neen/code-vtubing/uc41-html-formatted-chapters
   code .
   ```
2. Install the **Live Server** extension if you don't have it (`ritwickdey.liveserver`).
3. In the VS Code file explorer, right-click `ao3-preview/preview.html` → **Open with Live Server**.
4. The preview opens in your browser at `http://127.0.0.1:5500/ao3-preview/preview.html`.

> **Why open VS Code from WSL?** Live Server is finicky with `\\wsl.localhost\...` UNC paths. Opening via `code .` in the WSL terminal makes it treat the project as a native Linux path — no issues.

---

## Using the previewer

- **Chapter dropdown** — select a formatted chapter to load it.
- **Load file** — pick any `.html` file from disk without needing the dropdown (no server required for this).
- **☾ Dark / ☀ Light toggle** — switches between light and dark backgrounds to check both modes.

---

## Adding chapters to the dropdown

Edit the `CHAPTERS` array near the top of the `<script>` block in `preview.html`:

```js
const CHAPTERS = [
  { label: "ch7 (formatted)", path: "../chapters/ch7.formatted.html" },
  { label: "ch8 (formatted)", path: "../chapters/ch8.formatted.html" },
];
```

Paths are relative to `preview.html`.

---

## Manual markup — skill colour without a label

For moments where a skill bleeds onto the page as raw text (breaking the established formatting intentionally), wrap the content in a bare `de-skill` span — no `de-convo`, no label, no bracket:

```html
<p><span class="de-skill electrochemistry"><strong><em>Him.</em> <em>Take him.</em> <em>He is the substance.</em></strong></span></p>
```

This gives the text the skill's colour only. Works with any skill class. Any inline formatting (`<strong>`, `<em>`, etc.) goes inside the span.

---

## Generating a formatted chapter

From the project root:

```bash
npx ts-node format.ts chapters/chN.html
```

Outputs `chapters/chN.formatted.html`. Live Server will pick up the new file immediately.
