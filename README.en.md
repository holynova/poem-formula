<p align="right"><a href="README.md">中文</a></p>

<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="Poem Formula — a moon and a key stitched together by a dashed bridge: linking distant things with one thread to create a stir">
</p>

<p align="center">
  <a href="https://xiaosang.cc/poem-formula/">▶ Read Online</a>
  ·
  <a href="https://github.com/holynova/poem-formula">GitHub Repository</a>
</p>

Poem Formula is a methodology site distilling Huang Fan's poetry course *《意象的帝国》* (The Empire of Images) around one core idea — "mismatch" （错配）: take a tangible scene, juxtapose something familiar with something lowly related to create estrangement, then ground it with one real link between them so the estrangement becomes precise, and finally organize local poetic moments into a whole poem with objective images, repetition, symbolism, metaphor, or structure. 10 chapters, 6 explanatory illustrations.

> Note: page numbers throughout refer to PDF file pages, not the printed book's page numbers. The report distinguishes "claims made explicitly in the book" from "engineering summaries made for the generator".

## Screenshot

<p align="center">
  <img src="./assets/readme/screenshot-site.jpg" width="720" alt="Site homepage: dark header for the 《意象的帝国》 poetry methodology, table of contents on the left, main text starting with Chapter 1, the book's core conclusion">
</p>

## The Core Formula

```
Poetic intensity ≈ semantic distance × felt connection × emotional truth
```

- **Semantic distance** creates estrangement: A and B must be far enough apart, or the pairing is just an everyday combination with nothing fresh.
- **Felt connection** creates precision: A and B must still share one felt link, or it's only a word game — easily obscure and hollow.
- **Emotional truth** creates resonance.

**Example.** "雨是城市忘在窗外的一串钥匙" ("Rain is a string of keys the city forgot outside the window") has distance (rain and keys belong to different domains) and a felt connection (both make continuous, fine tapping sounds, and both hang outside doors and windows). Writing only "雨是悲伤" ("Rain is sorrow") has neither enough distance nor a visible scene.

## Contents

| Chapter | Topic |
|---|---|
| 1 | The book's core conclusion |
| 2 | The three-layer methodology (writing process / the line engine / organizing a whole poem) |
| 3 | The nature of "mismatch" |
| 4 | A unified explanation of the four formulas |
| 5 | Upgrading "mismatch" from random collage to controlled generation |
| 6 | Expanding one formula into a short poem |
| 7 | Quality control: telling a good mismatch from a random pairing |
| 8 | Revision advice for the four-formula prompt |
| 9 | A ready-to-use optimized prompt |
| 10 | Final judgment |

## Four Patterns

| Pattern | Form | Description |
|---|---|---|
| ① Mismatched substitution | `S(A) → S(A's B)` | Swap A's modifier for B's |
| ② Forced identity | `A is B` | Assert directly that A is B |
| ③ Reinterpreting A through B | — | See A again from B's perspective |
| ④ Making A do what A cannot do | — | Give A an action beyond its nature |

## Quality Gate & Three Gates

Each candidate image scores 0–2 on six internal criteria: distance, connection, concreteness, accuracy, insight gain, coherence. **Below 8 out of 12, it never reaches the final draft.** Cases that must be cut include: A and B are a fixed collocation, both are abstract concepts, swapping in any other noun leaves the sentence about the same, the text later explains "this symbolizes…", or one short poem piles up many unrelated ornate images.

Staying faithful to the book's method takes more than four generation formulas — it takes three gates:

```
Mismatch generation → Connection calibration → Organization & revision
```

The four formulas are the engine; connection is the steering wheel; objective images, structure, and revision are the body and the road.

## Site Tech

- The content source is `意象的帝国_写诗方法论.md` (387 lines); the build script `build-html.mjs` renders it with `marked` into a single-file `index.html` (8.5 MB, 6 illustrations embedded as base64, readable offline).
- The site has desktop and mobile table-of-contents navigation (auto-generated from level-2/3 headings, highlighting the current chapter on scroll).
- The only dependency is `marked`; the build is reproducible (locally verified: output matches the committed `index.html` byte for byte).

```bash
npm install
npm run build   # node build-html.mjs, generates index.html
npm test        # Same as npm run build
```

```
意象的帝国_写诗方法论.md   Content source: 10-chapter methodology (387 lines)
build-html.mjs             Build script: marked rendering + base64 illustration embedding + TOC generation
index.html                 Build output: single-file site (8.5 MB)
assets/poem-formula-illustrations/   6 explanatory illustrations (Xiaohei theme)
assets/readme-screenshot.png         Old README screenshot (renamed to .jpg and reused)
```
