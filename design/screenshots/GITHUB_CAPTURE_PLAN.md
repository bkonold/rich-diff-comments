# GitHub store screenshot capture plan

Create four 1280×800 screenshots for the current GitHub store set. The set should explain the whole product rather than concentrating on one release. Use the same visual frame as the ADO set: pale header, large benefit-led title, one concise subtitle, and a cropped product view below.

## Shared capture rules

- Capture GitHub in light theme at a consistent browser zoom and viewport.
- Use `test_md_files/sample-design-doc.md` as the canonical source document and keep the same pull request throughout the set.
- Keep repository, branch, and comment text safe for public store listings.
- Show one primary workflow per image; avoid covering important rendered content with the sidebar.
- Prefer one restrained orange annotation when discovery would otherwise be difficult.
- Do not show unfinished GitHub v1.10.0 controls or claim functionality that has not shipped.
- Export final images directly under `design/screenshots/github/` as `github_screenshot_1.png` through `github_screenshot_4.png`.
- Verify every final PNG is exactly 1280×800.

## Visual design specification

Use the same outer frame as the canonical ADO screenshots so both store listings read as one product family. The palette was measured from the existing ADO PNGs.

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
- Preserve GitHub and Primer's native colors and fonts inside the product crop; only the outer frame is shared with ADO.
- Use bold annotation text only when needed for legibility. Do not introduce additional accent colors.
- Keep arrows and outlines clear of comment text, identities, and primary actions.
- If a reusable compositor is introduced, keep these defaults synchronized with the ADO plan.

## 1. Review rendered Markdown where you read it

**Subtitle:** Comment on paragraphs, lists, tables, and code—without switching to source diff.

**Capture:**

- Use the `Overview` section of `test_md_files/sample-design-doc.md`.
- Target the first overview paragraph beginning `This is the overview paragraph` so the heading, formatted prose, link, and numbered list remain visible together.
- Show the blue `+` beside that changed paragraph.
- Keep the inline editor open with: `Could we clarify whether ordering means source order or rendered order?`
- Include the Write/Preview tabs and Markdown toolbar.
- Keep enough rendered content visible to make rich-diff context unmistakable.
- Optional annotation: `Comment directly in rich diff` pointing to the `+`.

This is the lead image because it explains the extension's core purpose without requiring prior product knowledge.

## 2. Keep every conversation in context

**Subtitle:** Read, reply, resolve, and revisit review threads beside the rendered content they discuss.

**Capture:**

- Open one inline thread with at least two comments.
- Show Reply and Resolve or Unresolve actions.
- Open the Threads tab with several realistic cards, including one resolved conversation.
- Ensure the selected sidebar card and inline thread visibly refer to the same discussion.

## 3. Scan what changed

**Subtitle:** Step through added, removed, and modified sections without rereading the unchanged document.

**Capture:**

- Open the Changes tab with several cards visible.
- Show a mix of added, removed, and modified rendered blocks.
- Keep the selected card and destination block visible together.
- Include a new-file or deleted-file summary card only if it fits without obscuring the main workflow.

## 4. Navigate the whole Markdown PR

**Subtitle:** Browse headings across changed files, jump to any section, and fold long documents by level.

**Capture:**

- Open the Outline tab with headings from more than one Markdown file.
- Show Fold H1/H2/H3 and Expand all controls.
- Select a nested heading and show the matching rendered section.
- Collapse at least two sibling sections so the folding benefit is visible.
- Optional annotation: `Fold long sections to stay focused` pointing to the bulk controls.

## Deferred: Stay oriented across changed files

**Subtitle:** GitHub's file tree, rendered document, and review sidebar stay synchronized as you move through the PR.

This is a candidate fifth slide for a future store refresh, not part of the current four-image set.

**Capture:**

- Show GitHub's native file tree with the current Markdown file visibly highlighted.
- Show the same file in the rendered review area.
- Keep the sidebar header visible with a file-scoped counter and PR-wide total.
- Use a pull request with multiple Markdown files so the cross-file value is obvious.
- Avoid duplicating the detailed Outline composition from screenshot 4; emphasize the three synchronized surfaces instead.

## Replacement policy

Keep the existing screenshots under `design/screenshots/1280x800/` until all four replacements have been reviewed. Once the new set is complete, use `design/screenshots/github/` as the canonical store-upload folder and retain the old set only if historical comparison is still useful.
