# Features & parity roadmap

This is the authoritative product roadmap for both browser-extension targets:

- **Markdown PR — Markdown PR Comments for GitHub**
- **Markdown PR Comments for Azure DevOps**

The goal is the same reviewer outcome on both services whenever the host platform makes that possible. Implementations do not need to be identical: GitHub rich diff and Azure DevOps Preview expose different DOM, navigation, identity, and API models.

Target-specific mechanics and constraints live in the small [GitHub feature notes](./github/FEATURES.md) and [Azure DevOps feature notes](./ado/FEATURES.md). Those pages do not duplicate priorities or status. Release history belongs in [CHANGELOG.md](../CHANGELOG.md) and [CHANGELOG_ADO.md](../CHANGELOG_ADO.md).

---

## How to use this roadmap

Every capability is defined once here from the user's perspective. Its two target cells expose parity gaps directly.

| Mark | Meaning |
|---|---|
| ✅ | Available in the target |
| △ | Partially available; follow-up remains |
| 📋 | Planned |
| ⏳ | Blocked on a platform capability or investigation |
| ↔ | Equivalent outcome supplied differently or natively by the host |
| — | Not applicable to that target |

Versions are independent and always target-qualified as **GitHub vX.Y.Z** or **ADO vX.Y.Z**.

Priority applies to the shared user outcome:

- **P0** — correctness or usability gap with frequent user impact
- **P1** — high value, planned next
- **P2** — useful follow-up
- **P3** — exploratory; build only with evidence of demand

### Documentation rule

- Update priority and target status **only here**.
- Add a target-note entry only when host behavior changes scope, acceptance criteria, or implementation risk.
- After shipping, condense the roadmap entry. Put user-visible release detail in the matching changelog, durable decisions in [GitHub approach](./github/APPROACH.md), and captured DOM/API findings in [GitHub developer notes](./github/DEV_NOTES.md) or [ADO developer notes](./ado/ADO_DEV_NOTES.md).

---

## ✅ Shipped

### Rendered commenting

| Capability | GitHub | Azure DevOps |
|---|---|---|
| Add a review comment from rendered paragraphs, headings, list items, table rows, and code blocks | ✅ GitHub v1.0.0 | ✅ ADO v1.0.0 |
| Create single-line and multi-line comments with editable source-line targets | ✅ GitHub v1.0.0 | ✅ ADO v1.0.0 |
| Track a specific line inside a fenced code block from the pointer position | ✅ | ✅ |
| Show new comments inline immediately without a manual refresh | ✅ | ✅ |
| Use the signed-in browser session without requiring a PAT | ✅ | ✅ |

### Threads and editor

| Capability | GitHub | Azure DevOps |
|---|---|---|
| Render existing conversations beside the corresponding rendered block | ✅ | ✅ |
| Reply, resolve/reopen, edit, and delete comments inline | ✅ | ✅ |
| Show resolved state and collapse resolved threads by default | ✅ | ✅ |
| Write with a Markdown toolbar, Write/Preview tabs, auto-grow, and Cmd/Ctrl+Enter | ✅ | ✅ |
| Render deleted-comment placeholders safely | ✅ | ✅ |
| Preserve reading position while thread actions update the page | ✅ | ✅ |

### Changes, Threads, and Outline

| Capability | GitHub | Azure DevOps |
|---|---|---|
| Use a draggable, resizable, collapsible sidebar with persistent layout and selected tab | ✅ | ✅ |
| Browse PR-wide Changes, Threads, and Outline lists grouped in stable file order | ✅ | ✅ |
| Navigate changed rendered blocks with cards, counters, clicks, and keyboard shortcuts | ✅ | ✅ |
| Show one summary card for a newly added, deleted, or renamed Markdown file where applicable | ✅ | ✅ |
| Navigate threads globally and filter to unresolved conversations | ✅ | ✅ |
| Browse headings across changed Markdown files with per-section thread counts | ✅ | ✅ |
| Fold individual sections or fold by H1/H2/H3 level and expand all | ✅ | ✅ |
| Show file-scoped position with a PR-wide total and jump header icons to the current file first | ✅ | ✅ |
| Follow native file navigation and keep sidebar selection synchronized | ✅ | ✅ |
| Hide or stand down outside the host's changed-files review surface | ✅ | ✅ |

### Activation and lifecycle

| Capability | GitHub | Azure DevOps |
|---|---|---|
| Provide an obvious action when rendered Markdown is not active | ✅ Render all Markdown files | ✅ Open Markdown Preview, ADO v1.1.0 |
| Move between changed Markdown files without rebuilding all PR-wide review data | ✅ | ✅ ADO v1.1.0 |
| Reject stale navigation and review state when the pull-request identity changes | ✅ | ✅ ADO v1.1.0 |
| Preserve sidebar layout and user preferences across navigation | ✅ | ✅ |
| Support light and dark themes | ✅ | ✅ |
| Support Windows forced-colors/high-contrast mode | △ Browser fallback | ✅ |

### Mapping and correctness

| Capability | GitHub | Azure DevOps |
|---|---|---|
| Map rendered blocks to source lines with the shared forward-scan matcher | ✅ | ✅ |
| Prevent diagrams, deleted content, and unmatched blocks from corrupting later line mappings | ✅ | ✅ where the content exists in Preview |
| Map table rows and fenced-code ranges without altering host markup | ✅ | ✅ |
| Handle YAML frontmatter without shifting the document's later line mappings | ✅ | △ Needs target-specific fixture validation |
| Build changed-block navigation from the host's available source information | ✅ Native rich-diff markers | ✅ Head/base source comparison |
| Keep diagnostic logging and local inspection hooks available without telemetry | ✅ | ✅ |

---

## 🚧 Planned / nice-to-have

### Correctness

- [ ] **P0 — Inline markers for table rows and code lines that already have comments**
  - **Outcome:** a reviewer can see which exact row or code line has a conversation even though the thread body must remain below the containing table or code block.
  - **GitHub:** 📋 Planned.
  - **ADO:** 📋 Planned.
  - **MVP:** persistent accent rail/background on every affected row or line; clicking the marker scrolls to and expands the corresponding thread.
  - **Constraint:** do not inject invalid children into table rows or split syntax-highlighted code DOM.

- [ ] **P1 — Improve rendered-block text-match accuracy**
  - **Outcome:** fewer comments rely on approximate fallback lines, especially in nested lists, blockquotes, fenced prose, and HTML-backed Markdown.
  - **GitHub:** 📋 Planned.
  - **ADO:** 📋 Planned through the shared matcher.
  - Establish a fixture baseline before changing the algorithm; preserve monotonic forward matching and safe source bounds.

- [ ] **P2 — Comment on deleted lines**
  - **GitHub:** 📋 Planned. The LEFT-side payload is known; work needs base-source mapping, side-aware anchors, and a distinct removed-line affordance.
  - **ADO:** ⏳ Blocked on a safe representation because Preview omits removed prose entirely.
  - Multi-line LEFT ranges, cross-side ranges, and mixed table-row deletion remain later follow-ups.

- [ ] **P2 — Match fenced prose/code blocks by their first useful source line**
  - **GitHub:** 📋 Planned.
  - **ADO:** 📋 Planned through the shared matcher.

- [ ] **P3 — Improve raw HTML block mapping**
  - **GitHub:** 📋 Exploratory for `<details>` and source HTML tables.
  - **ADO:** 📋 Exploratory where Preview emits a corresponding rendered block.

- [ ] **P3 — Add hunk-aware comment eligibility only if rejection evidence requires it**
  - **GitHub:** ↔ Real-PR testing has accepted comments on unchanged lines outside visible hunks; do not restrict buttons without a reproducible rejection.
  - **ADO:** ↔ No current fixture or live evidence requires an additional hunk gate.
  - Retain this as a monitoring decision so marker/thread maps are not mistaken for the set of valid review lines again.

### Review and collaboration

- [ ] **P2 — ADO `@mention` autocomplete parity**
  - **GitHub:** ✅ Available with pre-warmed collaborator suggestions.
  - **ADO:** 📋 Planned; validate identity search, permissions, ranking, result size, and insertion syntax before implementation.

- [ ] **P2 — Reactions on comments**
  - **GitHub:** 📋 Planned; mutation endpoint needs validation.
  - **ADO:** 📋 Planned; REST support needs investigation.

- [ ] **P2 — Quick reply from a sidebar thread card**
  - **GitHub:** 📋 Planned.
  - **ADO:** 📋 Planned.
  - Keep the input compact and reuse the existing editor and submission paths.

- [ ] **P2 — Character-range comments through portable metadata**
  - **Outcome:** visually highlight a selected phrase while retaining the host's native line-level review anchor.
  - **GitHub:** 📋 Exploratory.
  - **ADO:** 📋 Exploratory.
  - Metadata must survive host rendering/editing and degrade cleanly to the native line anchor when absent.

- [ ] **P3 — Apply suggested-change blocks from the rendered review surface**
  - **GitHub:** 📋 Exploratory; GitHub's native React-bound controls cannot be reused directly.
  - **ADO:** ⏳ Investigate whether an equivalent review suggestion model exists.

- [ ] **P3 — Live arrival of comments posted elsewhere**
  - **GitHub:** 📋 Exploratory.
  - **ADO:** 📋 Exploratory.
  - The Threads pane is the preferred notification and merge surface.

- [ ] **P3 — Always-visible inline reply editor**
  - **GitHub:** 📋 Exploratory.
  - **ADO:** 📋 Exploratory.
  - Evaluate the reduced click cost against the permanent vertical space added to every expanded thread.

### Navigation and focus

- [ ] **P1 — Current-file focus for Changes and Threads**
  - **Outcome:** reduce sidebar clutter while reviewing one file without corrupting global navigation state.
  - **GitHub:** 📋 Planned; a rebuild-on-scroll implementation was attempted and reverted.
  - **ADO:** 📋 Planned.
  - Prefer collapsible file groups or a presentation-only filter. Do not rebuild card arrays on file-boundary scroll events or share click-navigation pin state with natural scrolling. See [GitHub feature notes](./github/FEATURES.md#current-file-focus).

- [ ] **P2 — Extend Changes navigation beyond Markdown**
  - **GitHub:** 📋 Planned; group visible source-diff lines into hunk-level cards rather than one card per line.
  - **ADO:** 📋 Planned; use ADO source-diff destinations for files without Preview.
  - Keep Outline Markdown-only and avoid eagerly expanding large collapsed diffs in the MVP.

- [ ] **P2 — Persist section-collapse state per file for the browser session**
  - **GitHub:** 📋 Planned.
  - **ADO:** 📋 Planned.
  - Scope state by service, repository, pull request, file, and stable heading key.

### Onboarding

- [ ] **P1 — First-activation walkthrough**
  - **GitHub:** 📋 Planned around rich-diff activation, the block `+`, the sidebar, and render-all.
  - **ADO:** 📋 Planned around Open Markdown Preview, the block `+`, and the sidebar.
  - The tour must be dismissible, keyboard-accessible, and versioned so materially changed steps can be shown again deliberately.

- [ ] **P2 — Prompt to refresh a pull-request tab that was already open during installation**
  - **GitHub:** △ Documentation currently explains the required refresh.
  - **ADO:** △ The same Chromium content-script limitation applies.
  - Do not add broad tab/scripting permissions without evidence that the documentation is insufficient. A hidden toolbar badge is not an adequate prompt.

### Target-specific opportunities

- [ ] **P2 — Persistent rendered-diff highlighting in ADO Preview**
  - **GitHub:** ↔ Native rich diff already shows additions and removals.
  - **ADO:** 📋 Planned. Reuse the existing source comparison to add persistent change rails or tints to mapped blocks.
  - Removed content remains out of scope until ADO has a safe rendered representation for it.

### Engineering quality backlog

These items protect both targets but are not user-visible features and do not belong in either changelog.

- [ ] Add focused DOM-injection tests for button/thread anchors and mutation-observer exclusions.
- [ ] Pin sanitized response fixtures for target endpoint normalization where mocked browser routes do not already cover the shape.
- [ ] Consider live throwaway-PR automation only if fixture suites stop catching a recurring host integration failure; never require credentials for the default test run.

---

## Intentional platform differences

Parity means the same useful outcome, not identical controls or internal behavior.

| Area | GitHub | Azure DevOps |
|---|---|---|
| Rendered surface | Rich diff is selected per file. | Preview is PR-wide and sticky. |
| Activation | Render every changed Markdown file as rich diff. | Open the selected or first changed Markdown file in Preview once. |
| Comment preview | Prefer GitHub's server renderer; bundled fallback. | Use the bundled local renderer. |
| Change discovery | Read native added/removed rich-diff markers. | Compare head and target Markdown because Preview has no markers. |
| File navigation | Synchronize GitHub anchor destinations and add an active-row treatment. | Drive ADO's native virtual TreeEx selection and rely on its selected-row state. |
| PR lifecycle | Reinitialize as GitHub replaces route and diff DOM. | Reload once on direct PR-to-PR SPA navigation to replace the complete runtime context. |
| Roles and outdated state | GitHub provides author-association and outdated-thread fields. | ADO has a GUID identity model and different thread-tracking semantics; do not invent GitHub-style labels. |
| Rendered thread scope | Markdown rich-diff files. | Markdown Preview files; non-Markdown threads have no rendered destination. |

---

## 🚫 Won't do (deliberate trade-offs)

The extensions fill gaps in rendered Markdown review. They do not replace native pull-request review surfaces.

- ❌ **Submit, approve, request changes, vote, or complete a full review.** Use the host's native pull-request controls.
- ❌ **Replace native viewed-state or whole-PR file navigation.** Use the host's file tree and viewed controls where available.
- ❌ **Duplicate line commenting in source diff.** Both services already provide it.
- ❌ **Replace the host's rendered-document surface.** The extensions augment GitHub rich diff and ADO Preview rather than becoming Markdown-rendering applications.
- ❌ **Clone host comment-form DOM.** Interactive behavior is tied to private application state; the extensions use their own stable editor instead.
- ❌ **Upload images through undocumented attachment endpoints.** Use the host's native editor when an upload is required.
- ❌ **Split or rewrite syntax-highlighted `<pre>` markup into permanent per-line wrappers.** Use overlays or non-destructive marks for code-line affordances.
- ❌ **Require a PAT or separate sign-in by default.** Existing signed-in browser sessions are the primary authentication path.
- ❌ **Promise perfect block matching for every renderer edge case.** Editable line targets remain the safety net while shared matching improves.
- ❌ **Build a VS Code extension for the same workflow.** The browser targets reuse the review pages, authentication, rendering, and native navigation that already exist.

Target-specific delegated behavior is documented in [GitHub feature notes](./github/FEATURES.md#github-specific-delegation) and [Azure DevOps feature notes](./ado/FEATURES.md#ado-specific-delegation).

---

## Documentation ownership

| Question | Source of truth |
|---|---|
| What should both products do, and what is each target's status? | This roadmap |
| How does GitHub differ? | [GitHub feature notes](./github/FEATURES.md) |
| How does Azure DevOps differ? | [Azure DevOps feature notes](./ado/FEATURES.md) |
| What changed for users in a release? | [GitHub changelog](../CHANGELOG.md) or [ADO changelog](../CHANGELOG_ADO.md) |
| Why is the architecture shaped this way? | [GitHub approach](./github/APPROACH.md) and the [ADO design/validation record](./ado/ADO_ADAPTER_PLAN.md) |
| What endpoint, DOM, or debugging detail was observed? | [GitHub developer notes](./github/DEV_NOTES.md) or [ADO developer notes](./ado/ADO_DEV_NOTES.md) |
| How is a target packaged and published? | [Publishing & Distribution](./PUBLISHING.md) |