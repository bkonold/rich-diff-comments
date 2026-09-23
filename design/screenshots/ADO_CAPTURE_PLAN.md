# Azure DevOps store screenshot plan

The canonical Azure DevOps store set contains four 1280×800 screenshots under `design/screenshots/ado/`. Together they explain the whole product rather than concentrating only on one release.

## Shared presentation rules

- Capture Azure DevOps in light theme at a consistent browser zoom and viewport.
- Use the same Markdown pull request and realistic review text throughout the set.
- Keep organization, project, repository, branch, identity, and comment text safe for public store listings.
- Use a pale blue-gray frame, a large benefit-led title, and one concise subtitle.
- Show one primary workflow per image.
- Use orange annotations sparingly and only for controls whose purpose is not obvious from the product view.
- Keep the Azure DevOps Files tab and Preview surface visible enough to establish context.
- Export every final PNG at exactly 1280×800.

## Visual design specification

The palette below was measured from the four canonical PNGs. Typography sizes are the baseline for future editable compositions; minor raster differences from the existing manually composed images are acceptable.

| Element | Setting |
|---|---|
| Canvas | 1280×800 |
| Frame background | `#EEF4FA` |
| Font family | `Segoe UI`, with `Arial`, sans-serif fallback |
| Title | approximately 42 px, weight 700, centered, `#172B4D` |
| Subtitle | approximately 22 px, weight 400, centered, `#5F6B7A` |
| Annotation accent | `#FFAB40`; use for arrows, outlines, and short annotation labels only |
| Horizontal text inset | approximately 60 px |
| Product crop | approximately 55 px from each side, beginning around y=173; preserve a frame border below the crop |

- Keep the title to one line where possible and the subtitle to one concise line.
- Preserve the host UI's native colors and fonts inside the product crop; do not recolor Azure DevOps to match the outer frame.
- Use bold annotation text only when needed for legibility. Do not introduce additional accent colors.
- Keep arrows and outlines clear of comment text, identities, and primary actions.
- If a reusable compositor is introduced, these values become its defaults and should be changed here before regenerating either target's set.

## 1. Review rendered Markdown where you read it

**File:** `ado/ado_screenshot_0.png`

**Subtitle:** Comment on paragraphs, lists, tables, and code—without switching to source diff.

**Composition:**

- Azure DevOps Markdown Preview is open.
- The inline comment editor appears below a rendered paragraph.
- The blue `+`, Write/Preview tabs, Markdown toolbar, and Comment action are visible.
- The document tree and Table of Contents establish that the reviewer remains inside the rendered document.
- Orange annotation: `Comment directly in Preview`.

This is the lead image because it explains the extension's core purpose without requiring prior product knowledge.

## 2. Keep every conversation in context

**File:** `ado/ado_screenshot_1.png`

**Subtitle:** Read, reply, resolve, and navigate threads beside the content they discuss.

**Composition:**

- The Threads tab shows multiple conversations and a resolved state.
- One inline thread is expanded beside the rendered table it discusses.
- Reply and Resolve actions remain visible.
- Thread indicators in the native file tree reinforce pull-request-wide conversation awareness.
- Orange annotations identify expand/collapse behavior and resolved status.

## 3. See what changed without leaving Preview

**File:** `ado/ado_screenshot_2.png`

**Subtitle:** Highlight added and modified sections, then navigate every Markdown change.

**Composition:**

- Modified sections use the warm changed treatment and pure additions use green.
- The Changes tab lists corresponding cards in document order.
- The selected card and its rendered destination are visible together.
- A `NEW FILE` summary card demonstrates pull-request-wide coverage without tinting an entire new document.

## 4. Navigate the whole Markdown PR

**File:** `ado/ado_screenshot_3.png`

**Subtitle:** Browse every heading across changed files and jump directly to the section you need.

**Composition:**

- The Outline tab contains headings from multiple Markdown files.
- A nested heading is selected and synchronized with the rendered document.
- Fold H1/H2/H3 and Expand all controls are visible.
- A rendered Mermaid diagram demonstrates navigation through rich document content.
- Orange annotation: `Fold long sections to stay focused`.

## Coverage and intentional omissions

The four-image set covers the core user journey:

1. Create a rendered comment.
2. Read and manage conversations.
3. Understand and navigate changes.
4. Navigate and fold a multi-file Markdown pull request.

Table-row markers, code-line markers, `@mention` autocomplete, dark theme, and sidebar dismissal are supporting capabilities rather than separate store slides. They can appear naturally in future recaptures, but should not displace one of the four core scenarios unless user feedback shows that the current set leaves an important product outcome unclear.

## Replacement policy

Replace an image only when the product UI or host chrome has materially changed, the image contains stale or unsafe data, or a clearer composition communicates the same outcome. Preserve the scenario order so store visitors continue to see the core commenting value first.
