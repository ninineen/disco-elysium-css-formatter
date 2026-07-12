# Disco Elysium CSS Formatter

A browser tool (+ CLI) that marks up Disco Elysium–style skill checks with the `ao3-adaptive-disco-elysium-workskin` CSS classes, for AO3 fic authors. Drop in a chapter's HTML, skill checks get auto-colored, copy the result back out. All client-side, nothing is ever uploaded anywhere.

## Use it online

### [Launch the Disco Elysium CSS Formatter](https://ninineen.github.io/disco-elysium-css-formatter/)

No installation needed. It runs entirely in your browser, and your chapter text is never uploaded.

This repo also holds the HTML-formatted chapters of *Unprofessional Conduct in the 41st*, my own Disco Elysium fanfic on AO3, which is what this tool was originally built to format. The chapter text itself is not a template and isn't free to reuse. See [License](#license).

---

## Connect with me

**Support my work:** [Buy me a coffee on Ko-fi](https://ko-fi.com/ninineen)

I make AO3 skins, stream on Twitch, and post fandom content across socials. Find me here:

<p align="left">
  <a href="https://archiveofourown.org/users/ninineen/profile" target="_blank"><img src="https://img.shields.io/badge/AO3-990000?style=flat-square&logo=archiveofourown&logoColor=white" alt="AO3"></a>
  <a href="https://twitch.tv/ninineen" target="_blank"><img src="https://img.shields.io/badge/Twitch-9146FF?style=flat-square&logo=twitch&logoColor=white" alt="Twitch"></a>
  <a href="https://bsky.app/profile/ninineen.bsky.social" target="_blank"><img src="https://img.shields.io/badge/Bluesky-0285FF?style=flat-square&logo=bluesky&logoColor=white" alt="Bluesky"></a>
  <a href="https://ko-fi.com/ninineen" target="_blank"><img src="https://img.shields.io/badge/Ko--fi-F16061?style=flat-square&logo=kofi&logoColor=white" alt="Ko-fi"></a>
  <a href="https://discord.gg/ninineen" target="_blank"><img src="https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"></a>
</p>

---

## Usage

> **Run all commands from WSL**, not Windows. `ts-node` and the app's dependencies are installed in the WSL environment: Open a terminal in Ubuntu and `cd` to the project root before running anything.

### Run the web app

**[Use it online](https://ninineen.github.io/disco-elysium-css-formatter/)**: no install needed, runs entirely in your browser, nothing is ever uploaded anywhere.

Or run it locally:

```bash
npm run dev
# http://localhost:5173
```

Drop your chapter's HTML in (or paste it), skill checks get auto-colored, click any line in the preview to touch up its skill/outcome by hand, then copy the result back out.

### Format a chapter from the CLI

Transforms a raw HTML chapter file and writes a `.formatted.html` alongside it, wrapping skill-check lines in the correct `de-convo` / `de-skill` / `de-check` spans. Same parser the web app uses under the hood.

```bash
npm run format -- chapters/ch2.html
# Writes chapters/ch2.formatted.html
```

### Run tests

```bash
npm test
```

### Build / deploy to GitHub Pages

Builds the web app into `build/` and publishes it.

```bash
npm run build
npm run deploy
```

---

## Read it on AO3

**[Read *Unprofessional Conduct in the 41st* on AO3](https://archiveofourown.org/works/84782906/chapters/229473821)**

---

## License

All rights reserved. © NiniNeen.

This is my original fanwork. The text of these chapters is **not** licensed for reuse, redistribution, adaptation, or republication anywhere, in whole or in part. Please do not copy, repost, or scrape this work. Not affiliated with ZA/UM.
