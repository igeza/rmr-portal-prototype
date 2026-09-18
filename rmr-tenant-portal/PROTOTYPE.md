# rmResident Portal — example prototype (Tenant)

Presentation-only click-through built to the structure in the `rmr-prototyping` skill, so it can become a real dev-handoff starting point later without a rebuild.

## Two separate tracks: MVP and Full Product

`index.html` (the launcher) splits into two independent click-throughs that don't link into each
other: **MVP** (`screens/dashboard.html` onward) and **Full Product** (`screens/community.html`
onward). They're deliberately not one combined nav — see each track's own scope note below.

## MVP — scope — deliberate deviation from the source mocks

**The sidebar only ever shows 4 tabs, in this order: Dashboard, Charges & Payments, Service
Issues, and Document Center.** (Labeled "Charges & Payments" to match the real nav component's
text in Figma — an earlier pass used "Payments & Charges" instead, since corrected everywhere:
nav label, page `<title>`, hero title, and the launcher `index.html`.) This is a standing decision for this prototype, not something derived from
any single Figma frame — real Tenant-menu mocks (like the Dashboard frame below) include more
items (Architectural Requests, Meter Readings, Community, Reservations, Notes, Polls,
Violations). Those are out of scope here on purpose — Community in particular now has its own real
page, but it lives on the separate Full Product track (see below), not merged into MVP's nav; an
earlier pass did add it as MVP's 5th tab, then removed it once told these are two separate
branches. When adding a new MVP screen from a Figma mock that shows the full menu, trim its nav
down to these same 4 items rather than reproducing every item the mock shows.

**Sidebar icons use `fill="currentColor"`, inlined as `<svg>` (not `<img src>`).** In the real
design system, the RMP Icon component's fill is bound to its `Color` variant, so the same glyph
renders gray by default and blue when its item is selected — a single Figma export can't capture
both. Since a referenced `<img>` can't be recolored via CSS, the 4 sidebar icons are inlined with
`fill="currentColor"` so they inherit `.rmr-menu__link`'s `color` (`text-secondary` by default,
`text-blue` when `.rmr-menu__item--active`) automatically — the icon always matches its label.
Apply the same pattern to any new sidebar item's icon.

## Full Product — scope

**Full Product has nine pages so far: `screens/community.html`, `screens/fp-account.html`, `screens/reservations.html`, `screens/architectural-requests.html`, `screens/polls.html`, `screens/meter-readings.html`, `screens/notes.html`, `screens/violations.html`, and `screens/reports.html`.**
Nothing on this track links to an MVP screen, and nothing on MVP links back — a first pass wired
the Directory Overlay's gear icon straight to MVP's own `account.html#settings`, which worked but
broke the "keep it separate from MVP" rule; corrected, per direct instruction, by forking a real
`fp-account.html`/`fp-verification-sent.html` pair onto this track instead (see below) and
repointing everything at those.

**`fp-account.html` and `fp-verification-sent.html` are full duplicates of MVP's
`account.html`/`verification-sent.html`** (same content: Details/Contacts/Settings/Linked Accounts
tabs, all 6 modals, same Samantha Carpenter data), not new sourcing — Account isn't its own Figma
mock, it's the same persona's same real account data either way, so duplicating the already-built
markup onto this track (rather than re-fetching from Figma) is the correct "reuse existing
components" call here, per the project's own rule. Two things changed from the MVP originals:
- **Chrome only.** `fp-account.html`'s sidebar shows Full Product's own single "Community" item
  (not MVP's 4 tabs) — same as MVP's own `account.html`, which shows its 4 tabs but none marked
  `--active`, since Account has never been a sidebar item in any source mock on either track; it's
  only ever reached via the header's "View Account". Its own header account-menu points "View
  Account" at itself (`fp-account.html`) and leaves "Payment Settings" as fake-submit (not asked
  for on this track). The Change Username modal's "Send Verification Email" button points at
  `fp-verification-sent.html`, not MVP's `verification-sent.html`.
- Everything else — every field, tab, and modal's real content — is untouched.

`community.html`'s own header account-menu now points "View Account" at `fp-account.html` (still
real navigation, not fake-submit); "Payment Settings" stays fake-submit since no Full Product
Payment Settings page exists yet. The Directory Overlay's gear icon (`.rmr-comm-iconbtn`) now links
to `fp-account.html#settings` (Full Product's own Settings tab), same `#settings`-hash deep-link
mechanism (`acctTabFromHash()` in `app.js`, shared by both tracks) as before.

As more Full Product pages get built, grow `fp-account.html` and `community.html`'s shared nav to
match (and cross-link between pages within this track), but keep not pointing at MVP's own screens.
`architectural-requests.html` is the third page added this way (after Community, then Reservations) —
its own source mock's full Tenant menu shows "Architectural Requests" *before* Community/Meter
Readings/Reservations in menu order, but per the established "append as built, not by menu position"
precedent (Reservations was itself appended after Community despite interleaving Maintenance/
Architectural/Meter in the real menu), it was added as this track's third nav item rather than
reordering the other two. `polls.html` is the fourth page added the same way — its own source mock's
full Tenant menu shows "Polls" *between* Notes and Violations (neither of which exist on this track
yet), so it was likewise appended as the fourth nav item rather than reordering or adding placeholder
tabs for Notes/Violations/Meter Readings, which aren't built. All four Full Product pages'
(`community.html`, `reservations.html`, `architectural-requests.html`, `fp-account.html`) shared nav
lists were grown to include it, same as every prior addition.

`meter-readings.html`, `notes.html`, and `violations.html` are the fifth/sixth/seventh pages added
the same way, all sourced from one Figma file (`Er93r9FDjMeltm07RhX66j`, "RMR UI Rewrite — Metered
Utilities, Notes and Violations") built for this specific feature set. That file's own Menu shows a
much larger 11-item combined nav (Dashboard, Charges & Payments, Maintenance Requests, Architectural
Requests, Meter Readings, Community, Reservations, Document Center, Notes, Polls, Violations) —
i.e. the MVP tabs merged into the Full Product sidebar. Per the same "keep Full Product's own nav
separate from MVP" rule established above (Full Product's nav has never included Dashboard/Charges &
Payments/Maintenance Requests/Document Center, even though those pages exist on the MVP track), only
the three Full-Product-native items — Meter Readings, Notes, Violations — were appended, in that
relative order, to all five Full Product pages' (`community.html`, `reservations.html`,
`architectural-requests.html`, `polls.html`, `fp-account.html`) shared nav lists; the MVP-only items
were left out. Each new page's own hero photo is a copy of the same shared MVP hero image (not the
distinct photo shown in this Figma file's own Context Bar), consistent with the "Context Bar/hero
photos ... consistently use the MVP hero photo" correction made when Architectural Requests/Polls
were added.

Violations Register merges its "3.1 Violations Register" (Open) and "4.1 Closed Violations Register"
mock frames into one page with Open Violations/Closed Violations tabs, the same real underline Tabs
pattern as Service Issues/Amenity Reservations/Architectural Requests (`.rmr-acct-tab`, wired via a
page-scoped `vio-tab`/`vio-panel` data-action pair in `app.js`, following that exact precedent). Only
the row with a full "Violation Details" mock (LANDSCAPE, 10/13/25) opens that modal; the other two
rows (CAR, NOISE — which do have their own Due Date/Description data in the register itself, just no
dedicated Details mock) are `fake-submit`, matching how Community's calendar only wires the one event
with its own Event Details mock and leaves the others as placeholders. Same reasoning on
`notes.html`: only the second row ("New account created via transfer...") has its own "Note Details"
mock (with a Files gallery), so only that row opens the modal; "Building Map updated" is fake-submit.
Meter Readings has no Details mock in this source file at all, so its register has no row
interactivity beyond the real Date Range/Utility filter inputs (fake, like every other filter in this
prototype — no page here actually re-queries data by date or utility).

Both detail modals' file/photo thumbnails reuse the existing `.rmr-svc-attach__thumb` /
`.rmr-svc-attach__thumb--file` classes (Service Issues' attachment-carousel component) rather than
adding new CSS, and reuse existing prototype photo assets as stand-ins (mock photo content, not real
listing photos) since the real photos referenced by the Figma mock aren't available outside Figma.

`reports.html` is the eighth page added the same way, sourced from a separate Figma file
(`fVDy9CF99dAmuid64Pjh5I`, "RMR Rewrite — Reports published for Associations"), not the Metered
Utilities/Notes/Violations file above. Same deal as before: that file's own Menu shows the full
11-item combined MVP+Full Product nav, but only "Reports" (the one Full-Product-native item) was
appended to all nine Full Product pages' shared nav lists, same MVP/Full Product separation rule.
Its own hero photo is again a copy of the shared MVP hero image, not the Figma file's own Banner
Image photo. The register's report names render as plain `.rmr-doc-tree__link` blue links
(fake-submit — no report-opening/download flow exists to wire them to, and this source file has no
Report Details mock to build one from), and its Search field is a plain labeled text input (`.rmr-
modal__field` + `.rmr-modal__input`, no leading icon, unlike `.rmr-doc-search` used elsewhere) since
the mock shows no search icon on this one. Added `.rmr-modal__input::placeholder` (italic
`--text-accent`) to `rmr.css` to match the mock's placeholder styling and the same treatment already
used by `.rmr-doc-search input::placeholder` / `.rmr-svc-comments__input::placeholder` — a real
shared Input Field default, not new-per-page fakery.

## Source

- **Dashboard**: pulled live via Figma `get_design_context` from
  `https://www.figma.com/design/hbQDUSRF1dLm35tCQAWeHQ/RMR-Rewrite--Dashboard?node-id=2163-6506`
  (frame "2.0.0 Tenant Dashboard", node `2162:4275`). Every color, spacing, and type value in
  `assets/rmr.css` came from `get_variable_defs` on that same node — nothing hand-picked.
- Icons and images used on the Dashboard were exported from that same file via the MCP asset
  URLs and downloaded into `assets/icons/` and `assets/images/` (the Figma-hosted URLs expire
  after ~7 days, so these are committed copies, not live links).
- **Payments & Charges**: pulled live via `get_design_context` from
  `https://www.figma.com/design/fPSZy4e0NwJMiTs345xXGy/RMR-Rewrite--Payments--Charges?node-id=2001-688`
  — that node (`2001:688`) is a options board with many candidate frames for this screen; per
  instruction, only **4.1.2 "Charges & Payments - Balance"** (node `2001:689`) and **4.1.3
  "Charges & Payments - All Activity"** (node `2001:1094`) were built (all the other numbered
  options on that board, including a "Report table" variant, were explicitly out of scope). The
  two frames share the same left-hand Balance/AutoPay card; the right-hand panel's real "Option
  Toggle" control switches between the two frames' table content. Assets are in
  `assets/icons/payments/` and `assets/images/payments/`. Tokens came from `get_variable_defs` on
  node `2001:689`.
- A first pass on this screen got several details wrong by assumption instead of checking the
  exact node — since corrected by re-fetching each one directly:
  - **Donut chart** (node `3013:44115`): each arc is a separately-exported SVG shaped to only its
    own slice, meant to sit at an exact `inset` within the 222px circle — stretching each one to
    fill the whole circle (what the first pass did) produces overlapping distorted shapes, not a
    ring. Fixed by giving each segment its exact Figma inset (`.rmr-pay-donut__seg--1..4` in
    `assets/rmr.css`).
  - **Open Credits banner** (node `2322:51873`): label is bold `text/secondary`, amount is bold
    `text/primary` — not the green "success" color the first pass invented for the amount.
  - **AutoPay banner** (node `2214:17011`, the instance actually embedded in the Balance frame —
    not the differently-named node an earlier research pass had latched onto): this state is
    **"AutoPay Scheduled"** (green `Status/Success` accent bar + icon, "Dec 1, 2025 up to $2000
    with **4534", a "Manage" text-link button), not a "Set up AutoPay" prompt.
  - **Option Toggle** active-segment text (node `2087:590264`): stays `text/secondary` (bold) —
    only the background/border turn blue, the text itself never does.
  - **"Make a Payment" button** (node `2040:61432`): this instance has no explicit height, so it's
    content-driven (~36px) rather than the 32px used elsewhere in the app — a real, deliberate size
    difference in the source file, not a bug to normalize away.
  - **Missing CSS tokens**: `--font-size-3xl`, `--line-height-xl`, `--line-height-2xl`, and
    `--secondary-text` were referenced by the Payments screen's CSS but never defined in `:root` —
    an invalid `var()` silently falls back to the inherited value rather than erroring, so the
    hero title and donut amount were rendering at the browser-default 16px instead of their real
    24px/28px-line-height spec. Caught by grepping `rmr.css` for every `var(--x)` used against
    every `--x:` defined; worth re-running that check (see git history / ask for the one-liner)
    after adding any new token-based rule, since this kind of gap fails silently.
  - **All Activity's Date Range field** (node `2087:627346`, the real "Input Field" component):
    an earlier pass invented its own merged label+box layout (56px tall, 12px label crammed
    inside a single bordered field) instead of pulling the real component, and placed it inline
    next to the Option Toggle. The real component is a label sitting *above* a 32px-tall bordered
    field (`.rmr-pay-field`/`.rmr-pay-field__input` now), and it's its own row *below* the toggle,
    not beside it — matches the "Content" frame's node `2001:1173`, which lays out Charges
    Header → Input Field → table as stacked siblings, each 24px apart.

## What's built vs. pending

| Screen | Status |
|---|---|
| `screens/dashboard.html` | Real — full fidelity to the Figma frame above (header, nav, balance hero, message banner, tasks, notifications, footer ad banners, account footer). |
| `screens/payments.html` | Real — frames 4.1.2 (Balance) + 4.1.3 (All Activity), toggled via the real Option Toggle, plus the Make a Payment and AutoPay setup overlay flows (see below). |
| `screens/payment-settings.html` | Real — landing page from node 2039:14660, linking out to `payment-methods.html` and reusing the shared AutoPay setup flow. |
| `screens/payment-methods.html` | Real — view + edit states from nodes 2099:7654 / 2045:418393. See "Payment Settings page" below for what was left out of this section's other frames. |
| `screens/autopay.html` | Real — disabled/scheduled/edit states from section "Autopay" (node 3276:27067). See "AutoPay page" below. |
| `screens/account.html` | Real — Details/Contacts/Settings/Linked Accounts tabs + 6 modals, from file `GHtjX6TVj9OpVUXTyShguj` section 1 (node 2693:6479). See "Account Settings" below. |
| `screens/verification-sent.html` | Real — standalone page, node 2405:13684. See "Account Settings" below. |
| `screens/maintenance.html` | Real — Open/Closed Issues register, an Add Service Issue overlay flow, and an Issue Details overlay, all from file `41cZMQjGcwZBmHWS8NggER`. See "Service Issues" and "Issue Details overlay" below. |
| `screens/document-center.html` | Real — Documents to Sign + Leases & Documents registers, from file `Sip0wuWPnMa5duL1L39HDn`, node `2786:46043`. See "Document Center" below. Replaces the old `lease-account.html` placeholder (deleted — its remaining unbuilt scope was "Messages", not Documents; Account is already covered by `account.html`). Now also has the Renewal Available banner + full renewal-review flow — see "Lease Renewal flow" below. |
| `screens/document-sign.html` | Real — new page, "Sign Document - Lease renewal" (node 3011:22250) + the "3.2.1.x" document-signature wizard, same file. See "Lease Renewal flow" below. |
| "Messages" | Not started. Needs a Figma link to the real Messages frame(s). No placeholder screen exists for it (the old combined `lease-account.html` stub was removed now that Documents has its own real screen). |

### Full Product track

| Screen | Status |
|---|---|
| `screens/community.html` | Real — Calendar + Directory/Helpful Resources cards, from file `dpx2KD3Fwy8Pf5GmhAfOto`, node `2183:15817`. Opens the real Directory Overlay, Helpful Resources Overlay, and Event Details overlays. First page on the Full Product track — see "Community page" below. |
| `screens/fp-account.html` | Real — a Full Product-owned duplicate of MVP's `account.html` (own chrome only, same real Details/Contacts/Settings/Linked Accounts content). Reached via `community.html`'s "View Account" and the Directory Overlay's gear icon. See "Full Product — scope" above. |
| `screens/fp-verification-sent.html` | Real — duplicate of MVP's `verification-sent.html`, reached from `fp-account.html`'s Change Username modal. |
| `screens/reservations.html` | Real — Month/Week/Day calendar + "My Reservations" (Upcoming/Past Requests), from file `NA7fceoWIE1dczLAJjYjSC`, node `2001:2844`. Opens the real New Reservation (payment-required) wizard and both Reservation Details states (Pending/Denied). Second page on the Full Product track — see "Amenity Reservations page" below. |
| `screens/architectural-requests.html` | Real — My Requests / Requests to Review register, from file `AsaQeq0Rbv6ubeIhdpYDiW`, node `2218:4516`. Opens the real Add Request overlay, a Service-Issues-style Request Details overlay (two-way Messages), and a Vote Details overlay. Third page on the Full Product track — see "Architectural Requests page" below. |
| `screens/polls.html` | Real — All Polls register (Board Meeting/Community Feedback/General Amenities), from file `H9lPveHrdlGnG3Xbw0c8xf`, node `2013:1330`. Opens the real 5-question "Take a Poll" wizard for Board Meeting (Yes/No, Dropdown, Star Rating, Text, Multiple Choice) and its Submitted confirmation. Fourth page on the Full Product track — see "Polls page" below. |

## Amenity Reservations page

Sourced from a fourth Figma file (`NA7fceoWIE1dczLAJjYjSC`, "RMR UI Rewrite — Amenity Reservations"), section "V1" (node `1:94`). Per direct instruction: build the 3 calendar views (Month/Week/Day, same pattern as Community's own Month/Week/Day), all the overlays, the **payment-required** New Reservation flow specifically (not the sibling "payment not required" / "no fee" variants also on the same board), and add some Past Requests content to the "My Reservations" sidebar's second tab.

**Sidebar: joins Community as this track's second real nav item.** This mock's own nav shows the full Tenant menu with "Reservations" highlighted — same situation as Community's own sourcing. Per the already-established Full Product convention (see "Full Product — scope" above, "grow `fp-account.html` and `community.html`'s shared nav to match" as more pages are added), `community.html` and `fp-account.html` both gained a second "Reservations" item, and this page's own nav shows both "Community" and "Reservations" (itself active) — still its own track, never pointing at MVP. The nav icon (`event_available`, 16×16, node `12:566`'s icon export, matching the existing `assets/icons/nav-event-available.svg`) is inlined with `fill="currentColor"`, same pattern as every other sidebar icon in this app.

**Main page** (node `2001:2844`, "2.0.3 Amenity Reservations"): a 376px-wide "My Reservations" card (Add New button, real Upcoming/Past Requests Tabs component, a short list of `Reservation:` items with a colored icon circle + title + date + status Lozenge + kebab) beside the Month calendar, reusing Community's own `.rmr-comm-layout`/`.rmr-comm-card`/`.rmr-comm-cal__grid` etc. structural classes wholesale (those are layout-only, not page-specific) — only the reservation pill itself needed a new `.rmr-rsv-event` component, since this page's own pills color their *entire* border (0.5px top/bottom/right + 2px left, all one color) rather than Community's own left-edge-only accent. Every cell's color/text-muting was reproduced literally cell-by-cell from the real node data (this page's own source was internally consistent, so — unlike Community's own cross-checked inconsistencies — no normalization was needed here).

**Week/Day calendar views** (nodes `2036:3290` / `2046:3704`) use the same flexbox-hour-cell simplification as Community's own Week/Day views (real hour range 11 AM–8 PM, one flex column per day) rather than the source's own absolute per-event pixel offsets — same precedent, same reasoning.

**Only one calendar event across the whole page opens a real overlay**: the Month view's Oct 24 "Theater Room" pill (green/`--status-success`, the only `<button>` among the sourced reservation instances) opens the real Pending Reservation Details. Every other calendar pill — including the Week/Day views' own Wed-17 "Clubhouse Room 1" instances, which the source itself marks as an `<a>` — is fake-submit, since no sourced Reservation Details content exists for anything but the Theater Room (Pending) and a second, unrelated Theater Room (Denied) reservation. Same "only one sourced example is wired, everything else fake-submits" precedent as Community's own Oct 15 Doggie Hangout.

**Reservation Details — two real states**, both full overlays (not a single overlay with swapped content), matching the two separate sourced frames exactly:
- **Pending** (node `2027:2947`, "2.0.6 Reservation Details"): Theater Room, 10/24/25, 7–8 PM, `$15.00` + "View Fee Breakdown", an Amenity Images photo, Notes ("Party of 15"), one attachment (`reservation_form.docx`), and a real "Cancel Reservation" footer button. Reachable from the sidebar's "Theater Room" (Pending) item and from the Month view's Oct 24 pill.
- **Denied** (node `2059:459901`, "2.0.7 Reservation Details"): Theater Room, 10/13/25, 7–8 PM, a real "Reason" field ("The clubhouse is getting painted and is no longer available during this time."), no Amenity Images, a much longer Notes paragraph, the same attachment, and **no footer button** (a resolved/read-only state — confirmed by re-checking the node directly, not assumed). Both use the real dot-style "Status Lozenge" component (`.rmr-rsv-status`, node `12:1278` in the design-system file — Yellow dot `#F5B619` for Pending, Red dot `--status-error` for Denied), distinct from the sidebar's own filled-background "Lozenge" badges (`.rmr-rsv-lozenge`).

**Past Requests tab — one sourced item, one invented.** Per direct instruction to "add some Past requests," and since the Denied Theater Room reservation above (10/13/25) is real, sourced content that never appears anywhere in the Upcoming list or calendar, it was used as-is for the tab's first entry — genuinely sourced, not invented, just relocated to the tab it actually belongs in. A second entry ("Clubhouse Room 1", Fri Sep 26, a gray "Completed" Lozenge) was invented to make the tab read as more than one item, per instruction; it's fake-submit only, since no sourced "Completed" detail view exists to open. The gray Lozenge fill (`--color-neutrals-400: #dbe1e5`) and the red one (`--color-red-200: #f7d7d7`) both came from the real "Lozenge" component's Gray/Red `fill=yes` variants (design-system file, node `482:944` / `482:948`) — not picked arbitrarily.

**New Reservation overlay — payment-required chain only** (3.0.2 → 3.0.3 → 3.0.4), per direct instruction; the sibling "payment not required" and "no fee" frames on the same board (3.0.5–3.0.8) weren't built:
- **Step 1** (node `2008:2968`, "3.0.2 New Reservation Overlay - payment", 928×770 — taller than the source's own 684px so its content fits without an internal scroll in the common case, same "fixed but generous" sizing as `.rmr-modal--payment`/`--autopay`): Select Amenity (single-option dropdown, "Theater Room"), description, Total Reservation Fee + "View All Fees", an Amenity Images photo, a Date field, Notes, the real Attachments dropzone (reuses Service Issues' `.rmr-svc-attach` wholesale — exact same "Choose a file or drag it here." component), and a real side-panel day-schedule preview. The Terms checkbox sits inline with the Continue button in the pinned footer (rather than as its own row above it, which is where the source frame puts it) — a deliberate one-off placement per direct instruction, not a cross-page pattern change.

  **Start Time / End Time and the day-schedule block are the same data, shown twice — per direct instruction, not a static preview.** The side panel is real, sourced content (node `2008:3115`), but per instruction it's now a genuinely interactive day-schedule: the block matching the reservation being created (`.rmr-rsv-side__slot--current`) is drag-to-move (grab the body) and drag-to-resize from **either** edge (`.rmr-rsv-side__resize--top` stretches the start time earlier/later while the end stays put; `--bottom` does the same for the end time), snapping to 15-minute increments, and all three gestures write straight into the Start Time / End Time fields (now plain display fields, `[data-rsv-field]`, not fake dropdowns — there's nothing left for them to independently offer once the calendar block is the source of truth). Implemented in `app.js` (`[data-rsv-current]` block, Pointer Events so it works with touch too).

  Both blocks share one visual family — thin border, a thicker colored left edge, per direct instruction "just like on the regular calendar" (reusing the main calendar's own `.rmr-rsv-event` anatomy) — rather than the current-reservation block getting a different border shape. What distinguishes them is fill and color, both amenity-driven via two custom properties on `.rmr-rsv-side` (`--rsv-amenity-color`/`--rsv-amenity-tint`, currently Theater Room's green, so a future multi-amenity Select Amenity only has to update those two values): the OTHER block ("11:00 AM - 2:15 PM," reserved by someone else) stays white-filled and read-only; the current-reservation block gets the amenity's own light tint fill instead of white, so it reads as "yours" while still belonging to the same pill family — cursor:grab and the two resize handles are the only cues marking it as the movable one.

  The hour range was widened from the source's own 12 PM–5 PM glimpse to 11 AM–9 PM (matching this app's existing Week/Day-view range) specifically so the grid needs its own internal scroll rather than always showing every hour at once, per instruction — a deliberate extrapolation past what the source frame itself shows, not a sourcing claim. The grid's own background was dropped (was `--background-primary` white; now transparent, so the gray `.rmr-rsv-side` shows through behind the hour rows — only the event blocks themselves are white/tinted) and the panel's own height is fixed (558px desktop) to land its bottom edge exactly on the left column's Attachments zone, rather than stretching to match whichever column is taller.

  **Bug caught in testing**: the base `.rmr-rsv-side__slot` rule carried `overflow: hidden` (originally added just to truncate long labels), which silently clipped the two resize handles' hit-testing along with their paint — both extend a few px past the slot's own box on purpose (`top:-6px`/`bottom:-6px`) so they stay easy to grab, but a clipped-away area receives no pointer events in any browser, so drags aimed at either handle were being caught by the slot's own move-handler instead (confirmed by instrumenting `pointerdown` and watching `e.target` resolve to the slot, never the handle, until this was fixed). Changed to `overflow: visible` on the slot, with `text-overflow: ellipsis` moved onto the label/booked-block text directly so truncation still works.

**Scroll architecture correction**: this step originally combined `.rmr-modal__body` and a custom `.rmr-rsv-content` class on the same element, which (per the CSS-cascades-per-property bug documented below) silently kept `.rmr-modal__body`'s own `flex-direction: column`, stacking the form and side panel instead of placing them side by side. Fixed by dropping `.rmr-modal__body` entirely and reusing Make a Payment's own `.rmr-pmt-body`/`.rmr-pmt-body--split` + `.rmr-pmt-main--pinned-footer` + `.rmr-pmt-scroll` scroll architecture verbatim, per direct instruction ("this should be similar to how payments overlays are in the MVP"): the outer overlay itself never scrolls, the gray side panel is a plain stretched sibling that never scrolls with the page, and only the left form's own `.rmr-pmt-scroll` region scrolls internally, as a last resort on short viewports.
- **Step 2** (node `2001:3139`, "3.0.3 New Reservation - payment required", 928×572): "Your Payment Method." The source frame itself shows a 2-option radio choice (Visa / New Payment Method), and an earlier pass built it that way — corrected, per direct instruction, to match Make a Payment's own single-method-row pattern instead, since "a tenant only ever has one payment method on file" is a standing rule for this prototype (see the Make a Payment overlay section below), not something this one frame should re-litigate just because its own mock happened to show two options. Now reuses `.rmr-ap-method-row`/`.rmr-pmt-new-form` verbatim — the exact same edit-in-place pencil pattern, and the same real Samantha Carpenter billing data — as Make a Payment's own `pay-method` step. The summary sidebar (Amount Due/Platform Fee/Total Due) and footer (Back / Zego Privacy Policy / Submit) reuse the Make a Payment flow's own `.rmr-pmt-summary`/`.rmr-pmt-field`/`.rmr-pmt-footer` classes and `.rmr-pmt-main--pinned-footer`/`.rmr-pmt-scroll` scroll architecture verbatim.
- **Step 3** (node `2001:3222`, "3.0.4 New Reservation Submitted"): reuses `.rmr-modal--narrow` + `.rmr-pmt-success` verbatim (the same "any future confirmation-style popup reuses this rather than a bespoke size" standing rule used for Document Signed Successfully), even though this frame's own footprint (401×456) differs slightly — Amenity/Date/Time/Reservation Fee rows, using this frame's own numbers (Theater Room, 10/15/25, 5–6 PM, `$15.00`) as-is rather than reconciling them with Step 1's own 2:30–3:30 PM selection, matching the established "don't force-merge data across independently-authored frames" precedent.

**Settings page out of scope.** The board's own `4.0.2 Amenity Reservation Settings` frame (node `2346:10808`) is a property-manager-side admin config screen (RMX design system, "Rent Manager" chrome) for enabling/customizing this tenant page — a different persona and a different design system entirely, not part of the tenant-facing rmResident Portal this prototype builds. Not built, and not a gap in this track's own scope.

**New assets.** `assets/icons/reservations/` (calendar-month, more-vert, calendar-today, file-download at its real 32×32 size) were exported fresh from this file's own nodes since no existing icon matched exactly; `assets/icons/community/cal-arrow-left.svg`/`cal-arrow-right.svg`, `assets/icons/documents/keyboard-arrow-right.svg`, `assets/icons/payments/{mp-close,mp-credit-card,mp-info-outline,mp-check-circle-filled,mp-checkbox-check,campaign}.svg`, and `assets/icons/service-issues/file-paper.svg` were all reused as exact matches (same glyph, same native size). `assets/images/reservations/hero.png` (the Context Bar photo) and `room-1.png`/`room-2.png` (the Amenity Images thumbnails) are this file's own real image fills, exported directly.

**Two bugs caught in testing, both fixed by re-checking the actual rendered DOM:**
- An accidental `*/` inside a CSS comment (the phrase "`__gutter*/__daycol*`", meant as a glob-style list) closed the comment early, silently dropping the entire `.rmr-rsv-event` base rule (every reservation pill rendered with default `<button>`/`<div>` styling — no color, `white-space: normal` instead of `nowrap` — until caught by inspecting `document.styleSheets` directly and finding the rule missing).
- `.rmr-rsv-content` (combined on the same element as `.rmr-modal__body`) inherited `.rmr-modal__body`'s own `flex-direction: column` since it never declared `flex-direction` itself — CSS cascades per-property, not per-class, so adding a second class doesn't reset properties the first class already set. The New Reservation form and its side panel stacked vertically instead of sitting side-by-side until `flex-direction: row` was added explicitly. `.rmr-btn--text` alone (without the also-required `.rmr-btn--link` modifier) renders white-on-white by design-system convention — "View All Fees" and "View Fee Breakdown" were invisible for the same reason until `.rmr-btn--link` was added.

## Community page

Sourced from a different Figma file than the rest of this prototype — `dpx2KD3Fwy8Pf5GmhAfOto`
("RMR Rewrite — Community Calendar and Directory Page Combined"), section `2183:15816` — which has
several sibling frames (Calendar-only, Directory-only, both combined at various feature counts, an
Account Settings variant). Per direct instruction, the built frame is **"3.1.1 Community Page - All
Features Enabled"** (node `2183:15817`): a full Calendar (main column) plus stacked Directory and
Helpful Resources cards (sidebar), each of which opens its own full-page overlay. Three overlays
from the same section were also built, per direct instruction: **Directory Overlay** (`2183:21942`),
**Helpful Resources Overlay** (`2428:97166`), and **Event Details** (`2183:15939`). The Calendar's
own **Week View** (`2183:16063`, "3.1.3 ... Both - Week View") and **Day View** (`2183:16237`,
"3.1.4 ... Both - Day View") were added later, real and switchable via the "View" dropdown — see
below. Not built: Event Details' own sibling frames for the Calendar/Directory-only variants, the
Account Settings variant, and the Open Folder overlay — none of those were asked for.

**Week/Day calendar views.** Both are real time-grids (an hour-label gutter + one flex column per
day), not the source's own per-event absolute-pixel positions — every event still sits in its real
hour cell, just laid out with flexbox instead of reproducing exact px offsets (a deliberate
simplification, same spirit as the Month view's own normalized cell-color rule above). The visible
hour range, **11 AM–8 PM**, is the union of what the two sourced frames each actually show (Week's
own frame starts at 12 PM; Day's own frame starts at 11 AM) — every hour label is real and sourced,
just merged across both frames' coverage rather than picked or invented. Skipped: the Week view's
own per-cell "early hours of Thursday are grayed out" detail (`--component-input-disabled`) — a
per-column quirk with no clear rule tying it to anything else on the page (Monday, not Thursday, is
the highlighted/"selected" day), so it reads as another source inconsistency rather than meaningful
content, and was left out rather than reproduced literally.

**The "View" control is the real RMR Dropdown component** (`.rmr-dropdown`/`.rmr-dropdown__trigger`/
`.rmr-dropdown__menu`/`.rmr-dropdown__option`, same file `W4wEUn8A4hkTdiAgEV8wSK` node `12:1560` as
every other custom dropdown in this prototype) — it was originally built as a plain single-option
`<select>` (a shortcut used elsewhere in this app when a field only ever shows one value), but the
source frame's own "View" field is the same real Input-Field-with-trailing-chevron component used
for the Property/Search fields already rebuilt as `.rmr-dropdown` elsewhere, and this one has 3 real
values (not 1), so it needed the real component. Selecting an option both updates the dropdown's own
selected/value state (generic `[data-dropdown]` behavior, shared by every dropdown in the app) and
switches the visible calendar panel + nav-row date label (new `[data-comm-view-select]` handler in
`app.js`, scoped to just this one dropdown). Only Month's Oct 15 "Doggie Hangout" opens the real
Event Details modal in every view (Week included) — every other event stays fake-submit, same
scope as Month view.

**Sidebar: just the one tab, on its own track.** This mock's own nav shows the full Tenant menu
(Dashboard, Charges & Payments, Maintenance Requests, Architectural Requests, Meter Readings,
Community, Reservations, Document Center, Notes, Violations). An earlier pass added "Community" as
MVP's 5th tab (inserted between Service Issues and Document Center, matching the full menu's own
relative order) and linked its header account menu out to MVP's Account/Payment Settings pages —
since corrected, per direct instruction, to treat Full Product as its own separate track from MVP
rather than merging into it (see "Full Product — scope" above): `community.html`'s sidebar now
shows only its own "Community" item, and its account menu is fake-submit rather than pointing at
MVP screens. The nav icon (`Groups`, 16×16, path from node `12:566`'s icon export) is inlined with
`fill="currentColor"`, same pattern as MVP's own sidebar icons.

**Calendar's per-cell background/text-color styling was normalized, not reproduced literally.**
Re-checking node `2183:15817` cell-by-cell (via `get_design_context`) found the source itself isn't
internally consistent — e.g. Oct 30 (row 6) has a gray `background/secondary` fill but *primary*
(dark) day-number text, while Oct 31 right next to it has the same gray fill but *accent* (muted)
text; Nov 2 (next month) renders with primary/dark text like an in-month day, while Nov 1 and Nov 3
either side of it don't. Rather than encode every individual cell's own quirk, this build uses one
coherent 3-zone rule that matches the overwhelming majority of real cells and reads correctly at a
glance: **rows 1–2 (the two weeks before Oct 14) → `--background-secondary` + muted `--text-accent`
numbers; Oct 14–31 → `--background-primary` + `--text-primary` numbers; the trailing Nov 1–3 →
`--background-primary` + muted `--text-accent` numbers.** Oct 15 is further highlighted
(`--component-selector` fill + `--border-button-tertiary` border) since it's the one date with a
real, sourced Event Details popup wired to it.

**Reservation-pill colors don't fully match the calendar's own legend.** The legend shows exactly 3
entries (Community Events → `--status-success` green, Movie Night → `--color-red-400`, Board
Meeting → `--color-blue-500` `#2a7de1`) but the calendar body actually uses **4** distinct border
colors: green and red match their legend entries, but Oct 20's second event ("Community ", 7:30 PM)
uses `--border-button-tertiary` (`#1a64bc`) — a different, if visually similar, blue than the
legend's own `--color-blue-500` swatch — and Oct 29's "Halloween Contest" uses a 4th color,
`--status-error` (`#ed4b52`, newly added to `:root`), which isn't in the legend at all. Both are
real values pulled directly from their own reservation nodes, kept as-is rather than force-matched
to the legend's 3 swatches. The "Community " event label's own trailing space and truncated wording
are also exactly what the source layer contains, not a display artifact.

**Directory card/overlay: a real duplicate row in the source data.** The Directory card's own
contact list (and the Directory Overlay's Name column) both end with two back-to-back "Noah Brown"
entries with identical phone/email/address — re-checked directly against the node, not an extraction
error. Kept as two rows, matching the "don't silently fix apparent source mistakes" precedent used
elsewhere in this file (e.g. the Payment Methods "Caprenter" typo).

**Helpful Resources card: 3 trailing contact-shaped nodes excluded as a source authoring artifact.**
Node `2395:7625` (the sidebar card's own scrollable content) ends with "Emma Johnson" / "Noah Brown"
/ "Emma White" sub-nodes — same names, addresses, and `Reservation Container`/`Name Container`
layer-naming pattern as the Directory card's own contact rows a few nodes over, and always outside
that card's own `overflow-clip` viewport (so never actually visible in the mock's own screenshot).
Read as a copy/paste bleed-through from the Directory card during Figma authoring, not real Helpful
Resources content, so they were left out of both the card and its overlay rather than reproduced as
phantom "resources." The 5 real items (HOA Files folder + its 3 files, Rules and Regulations,
Riverview Property Map, Payment Options, Leasing Office Hours) are built in full.

**Helpful Resources Overlay's tree reuses Document Center's `.rmr-doc-tree` component wholesale**
(toggle button, 90°-rotating `keyboard-arrow-right.svg` chevron, indent spacer, cascading JS
collapse/expand) for the HOA Files folder, rather than sourcing new up/down chevron assets and a
second toggle behavior for what both source frames show as the same underlying idea (a
collapsible file group) — the one deliberate reuse-over-re-source call on this page, per the
"reuse existing components" project rule. The "Safe & Secure Storage" property tab is real, sourced
markup but not wired to different content (matches the existing single-real-option precedent used
for every other one-choice control in this prototype — e.g. Payment Method/Country selects).

**Assets.** New icons in `assets/icons/community/` (call, email, open-in-new, pdf/file, the three
calendar chevrons) were exported fresh from this file's own nodes — none of the existing
`assets/icons/documents/` or `assets/icons/payments/` icons were an exact visual match, though
`print.svg`, `file-download.svg`, `folder.svg`, `search.svg`, `setting.svg`, and `mp-close.svg` (all
already shared across screens) were reused as-is since they are exact matches. The hero photo
(`assets/images/community/hero.png`) is this file's own Banner Image fill, exported directly (same
"real photo behind a `--background-element` scrim" hero pattern already used everywhere else).

## Lease Renewal flow

Sourced from file `Sip0wuWPnMa5duL1L39HDn`, the same "prototype" section (node `3012:23438`) as Document Center itself — two sourced-but-separate Figma sub-families, connected into one click-through path per direct instruction rather than left as two dead-ended fragments:

- The **"3.3.x" Renewal Offer family**: Document Center w/ Renewal Available (`3026:59418`), Review Multiple Term Offers / Accept & Sign (`3047:16295`), Decline All Offers (`3047:18766`), Decline Renewal — singular (`3005:21502`, built as real CSS/markup precedent but not wired to a reachable entry point since this persona's default state is the multi-offer one), singular offer (`3005:21257`, same — not wired for the same reason), and Document not ready (`3047:18746`).
- The **"3.2.1.x" Document Signature wizard**: Lease Preference (`2667:18935` — the exact node given for this screen, superseding the section's own duplicate copy at `3012:22477`), Add Signature (`3039:13795`), Document Signature preview (`3012:22514`), Missing Required Fields (`3039:13767`), Submit Signed Document (`3039:13850`), Document Signed Successfully (`3293:13617` — confirmed via `get_metadata` to be exactly **400×320**, i.e. the same footprint as the existing `.rmr-modal--narrow` already used for Make a Payment's success screen; kept at this size per instruction so any future confirmation-style popup in this prototype reuses it rather than a bespoke size).

**How they connect (a scope decision, not a Figma-stated link):** Document Center's new Renewal Available banner (reuses `.rmr-pay-autopay`'s bar+icon+text+button shape verbatim, just a new icon/copy — no new CSS needed) opens Review Multiple Term Offers. Its footer button is genuinely labeled "Accept Offer" (not "Accept & Sign", unlike the singular-offer frame) — read as "acceptance recorded, document being generated," which is exactly what "Document not ready" describes. Rather than dead-ending there, "Accept Offer" links straight to `document-sign.html` (the generated Lease Renewal Request letter), since the whole point of this build is to reach the signature wizard; "Document not ready" is still real, styled content, but is wired instead to the Leases & Documents tree's "(Upcoming)" lease row (`p1-l1`), which already had nothing to expand — a natural, well-motivated home for it that needed no invented content or entry point.

`document-sign.html` reuses the Document Center header/nav chrome (Document Center stays the active tab) around the actual letter, styled as a plain printed page (`.rmr-sign-doc`, Georgia serif) rather than app chrome, with a small tools sidebar (page nav — inert, since this letter is always 1 of 1 — Sign, Finish Signing). The wizard is a 3-step flow (Lease Preference → Add Signature → Document Signature), built as a real state machine rather than a static click-through:

- Lease Preference's "Confirm Selection" and "Next" both advance to Add Signature — Figma gives both buttons equal primary styling with no stated behavioral difference, so both were wired the same way rather than inventing a distinction.
- Finishing the Document Signature step (its "Sign" button, `sign-complete` in app.js) fills in the letter's own embedded dropdown ("12-month lease renewal") and reveals a cursive signature line at the bottom of the letter itself, and flips the sidebar Sign button to a green "Signed" state.
- **Finish Signing** checks that state: not yet signed → the real Missing Required Fields error (its "Add Signature" link jumps back into the wizard); signed → Submit Signed Document → Document Signed Successfully, whose close link is a real navigation back to `document-center.html`.
- Closing that success screen sets a `rmr-renewal-signed` localStorage flag (same pattern as the AutoPay flow's own persisted state) so the Renewal Available banner hides itself on return — it's already been reviewed and signed, so re-inviting review would be wrong, and there's no sourced "already signed" banner content to swap in instead.

The cursive signature ("Samantha Carpenter") uses `font-family: 'Alex Brush', ... cursive` with no web-font `<link>` — consistent with this prototype's existing, accepted precedent of declaring `'Lato'` by name with a plain `sans-serif` fallback and no actual font loading anywhere in the codebase.

The Renewal Available banner's icon (`assets/icons/documents/description.svg`) is a hand-drawn Material "description" glyph (folded-corner page, solid `#1A64BC` fill) rather than a Figma-exported asset — the same "spent research cycle chasing one trivial universal glyph" call already made for the Account Settings "+" icon, since this is a standard, unambiguous system glyph and the design system's own icon library search didn't surface a matching library component for it.

**Correction: the property-level chevron in Leases & Documents is now a real, working toggle.** It was originally a static `chevron-down.svg` — always "expanded," matching the one state the source mock showed — but on request it now uses the exact same `.rmr-doc-tree__toggle` button + `keyboard-arrow-right.svg` component as the lease-level rows, so all three levels (property/lease/doc) share one real toggle pattern. This needed a small generalization in `app.js`'s `doc-tree-toggle` handler: collapsing a row now always cascade-hides every descendant regardless of that descendant's own state, while expanding only reveals immediate children and lets each one's own remembered `data-doc-tree-expanded` decide whether it re-reveals its own children — so collapsing/re-expanding "Riverview Apartments" doesn't also force back open a lease row you'd deliberately collapsed first.

**Correction: every Context Bar / "Account image" hero is now exactly 64px tall, with 16px between hero → banner → content everywhere.** `.rmr-pay-hero` (Charges & Payments) was `min-height: 64px` with symmetric 24px padding, so real content pushed it to 76px tall — a real inconsistency next to every other page's hero (`.rmr-settings-hero`, already a fixed `height: 64px`). Changed to a matching fixed `height: 64px` (the symmetric padding still centers the title/address via flexbox with no clipping, since a fixed border-box height plus centered flex content just centers around the same midpoint regardless of padding). Separately, `.rmr-settings-page`'s own `gap` (used by Document Center, Account, Service Issues, Sign Document, Payment Settings, Payment Methods, and AutoPay — every hero → message banner → Renewal Available banner → content chain) was `var(--spacing-2xl)` (24px); changed to `var(--spacing-md)` (16px) per instruction. `.rmr-pay-hero`'s own hero→banner gap and `.rmr-pay-section`'s banner→content gap were already 16px, so Charges & Payments only needed the height fix.

**Correction: several input fields were showing the browser's own native focus/autofill styling instead of the design system's real Selected state (a light-blue tint + blue border, already defined and used correctly on most fields via `.rmr-modal__input:focus` etc.) — several fields were simply missed when that treatment was first built.** Fixed, each the same way (`outline:none` on the bare input, the real Selected background/border applied to whichever element actually carries the border — the input itself, or its wrapper if the input is borderless inside one): the Document Center search field (`.rmr-doc-search`), the Make a Payment "Other Amount" input (`.rmr-pmt-amount-input input`) and itemized Pay Amount cells (`.rmr-pmt-pay-input`), and the Service Issue Details comment box (`.rmr-svc-comments__input-row`). The custom checkbox's real (`opacity:0`) native `<input>` also got its own `:focus-visible` ring forwarded to the visible box, rather than leaving the browser to draw one around the invisible input. Also added a blanket `:-webkit-autofill` override (transparent 1000px inset box-shadow trick) so Chrome/Safari's pale-yellow "recognized field" autofill tint — which can appear on realistic-looking fields like the pre-filled email/name fields regardless of focus — never shows through as a competing "selected" look.

**Standing rule going forward: never render an icon smaller than its own native SVG size.** The bug this caught: `chevron-down.svg` is natively 24×24 but was being rendered at 20×20 in that property-row `<td>`, a real compression the working lease-level rows (which use the *actually* 20×20-native `keyboard-arrow-right.svg`) didn't have. Per direct instruction, every icon's `width`/`height` (or its wrapping CSS box) must match the SVG's own declared size — check the file before sizing it, don't reach for a convenience number. Also fixed on `document-sign.html`, introduced in the same session: the page-nav chevrons (`keyboard-arrow-right.svg`, native 20×20) had been set to 14–16px, and the sidebar "Sign" icon (`description.svg`, native 24×24, see above) had been set to 20px — both bumped to native. The "Finish Signing" icon was also swapped from `mp-check-circle-filled.svg` (native 64×64 — the Make a Payment success icon, never meant to run this small) to `check.svg` (native 20×20, already used elsewhere in this same tree for signed-document rows), rather than force-scaling a 64px asset down to sidebar-icon size.

Per the skill's one rule — nothing is invented — the remaining placeholder screens were **not**
filled in with guessed content. Once their Figma links are provided, pull `get_design_context` +
`get_variable_defs` on those frames the same way and replace the placeholder shell.

### Payments & Charges — one data note

The "All Activity" table's **Late Fee** column has 13 rows in Figma while every other column
(Date/Type/Details/Reference Number/Charge Amount/Balance) has 11 — a genuine mismatch in the
source file, not an extraction error (confirmed by re-fetching that column's node directly). The
built table uses the first 11 Late Fee values, which cross-checks cleanly: the one non-zero value
($20.00) lands on the "11/01/25 Rent" row, matching the same charge's $20.00 late fee on the
Balance page's Open Charges table. The other 2 values weren't used. If this table gets revisited,
re-check node `3013:43995` in Figma directly.

**Correction: one color block per Open Charges row, "Per Day Late Fees" legend hidden.** The
"11/01/25 Rent" row's swatch cell originally carried two stacked color blocks (a rent swatch plus a
separate "autopay" swatch) — the only row in the register built that way, every other row has one.
Simplified to a single rent swatch, matching the "10/01/25 Rent" row and every other row in the
table. The Balance Due donut's legend also had a fourth "Per Day Late Fees" entry (own swatch color)
that's now removed by the same request; the donut chart's own segments are unchanged. The
now-unused `.rmr-pay-swatch--latefee` / `.rmr-pay-swatch--autopay` / `.rmr-pay-charge-item__swatches`
rules were removed from `rmr.css`.

**Fix: no swatch was visible at all after that simplification.** `.rmr-pay-swatch` had no `display`
set, so as a bare `<span>` it defaulted to `display: inline` — and an inline, non-replaced element
ignores explicit `width`/`height` entirely. It only ever looked right in the donut legend, where the
swatch is a flex item of `.rmr-pay-charge-item` (flex items always respect sizing regardless of their
own `display`); every `<td>` swatch in the Open Charges table was invisible from the start, not just
after this change. Fixed by adding `display: inline-block` to `.rmr-pay-swatch` itself. Re-verified
against the Figma mock (`fPSZy4e0NwJMiTs345xXGy`, node `2001:689`): all 5 Open Charges rows' swatch
colors match the source (Rent Charges → dark navy, Utilities → medium blue, Other Charges → light
blue, Parking Garage grouped under the Rent Charges color same as the mock).

## Make a Payment overlay flow

Sourced from file `fPSZy4e0NwJMiTs345xXGy`, section "Make Payment" (node `2001:1352`, ~13
candidate frames). Per instruction, only the **core flow** was built — three modals chained off
the Payments screen's "Make a Payment" button:

| Step | Overlay | Node ID |
|---|---|---|
| 1 | 4.2.1 Select Amount | `2001:1378` |
| 2 | 4.3.1 CC Payment Method | `2043:15963` |
| 3 | 4.2.4 Success | `2001:1353` |

**Scope decisions, from direct user answers (the board itself was ambiguous — asked rather than
guessed):**
- The numbering on the board skips a step "4.2.2", and there's a separate unnumbered "Select
  Amount" frame. Per instruction, **4.3.1 "CC Payment Method" is a state of the same overlay as
  4.2.1**, not an independent step 2 — i.e. Select Amount and Payment Method are two sequential
  views of one Make a Payment flow, not two different flows.
- Out of scope for this build (per "Core flow" answer): the itemized error/overpay states, the
  account-group variant, and the No Card / ACH payment-method states. If any of those get added
  later, re-fetch their exact nodes from the same section — don't extrapolate from the built flow.
- The unrelated "6.2.1 Schedule Autopay" frame on the same board was not part of this ask and
  wasn't built.
- Two frames prefixed **"Reference:"** (e.g. `2043:17085`, "One-Time / Replace Card") show what
  "New Payment Method" looks like fully expanded, with the modal itself grown taller to fit. Per
  instruction, the *content* of that expansion is real and was built (Payment Method select, Card
  Number/Expiration/Security Code, Billing Information block) — but the **modal does not grow**.
  `.rmr-modal--payment` stays a fixed `608px` tall (matching 4.3.1's own height) in both states;
  `.rmr-pmt-main` scrolls internally (`overflow-y: auto`) so the expanded form is reachable without
  resizing the overlay. This was a deliberate interpretation given directly by the user, not a
  Figma-derived detail.

Assets are in `assets/icons/payments/` and `assets/images/payments/` (the `mp-` prefix avoids
collisions with the Payments & Charges screen's own asset files in the same folders). New CSS
tokens (`--background-secondary`, `--text-accent`, `--font-size-5xl`, `--line-height-3xl`,
`--spacing-xxxs`) came from `get_variable_defs` on the same nodes.

Two bugs caught in testing, both fixed by re-checking the actual rendered DOM rather than the
markup alone:
- **`.rmr-pmt-new-form[hidden]`**: the class set its own `display: flex`, which silently beat the
  browser's default `[hidden] { display: none }` UA style (same specificity, later in the
  cascade) — the expanded form showed even when "Visa" was selected. Every other hidden-by-default
  element in this app (`.rmr-account-menu[hidden]`, `.rmr-modal-backdrop[hidden]`,
  `[data-pay-view][hidden]`) already had its own explicit `[hidden]` override for this reason; this
  one was missed when the class was first added.
- **CVV trailing icon**: `mp-cvv.svg` was downloaded but never referenced in the Security Code
  field markup. Added as `.rmr-pmt-cvv-wrap`/`.rmr-pmt-cvv-icon`, absolutely positioned inside the
  input per the Figma frame.
- **Missing `--component-selector` token**: every "selected" selector-card (the Select Amount
  cards, the Visa/New Payment Method rows) was rendering with a plain white background instead of
  the real light-blue `#f6fafe` tint — `var(--component-selector)` was used in three new rules but
  never added to `:root`, so it silently fell back to no background rather than erroring. Same
  failure mode as the earlier Payments & Charges token gaps (see above) — re-checked with
  `get_variable_defs` on node `2043:17085`, confirmed `Component/Selector: #f6fafe`, and added it
  to `assets/rmr.css`'s "Color / component" section.
- **"New Payment Method" nested double-border**: the selected/expanded state was first built as
  two independently-bordered boxes — the radio row (`.rmr-pmt-method`) and the form
  (`.rmr-pmt-new-form`) each got their own blue border + tint — which reads as a box nested inside
  a box. The real "Reference" frame (`2043:17085`) models this as **one** bordered/tinted card
  wrapping the radio, title, checkbox, and the entire form together. Fixed by moving the
  selected-state border/background to the outer `.rmr-pmt-new-method` wrapper
  (`.rmr-pmt-new-method--selected`) and stripping the inner button/form's own border and
  background so only the single outer box shows.
- **Wrong Flex logo asset (both here and on the Dashboard)**: the "Powered by [logo]" Flex mark
  is a Figma image fill that's cropped down from a larger source image — the frame is only
  `43.52×20px`, but the underlying PNG is scaled to `274.5%`/`381.45%` and positioned to show just
  the "flex" wordmark inside that crop. Downloading the raw asset URL directly (what an earlier
  pass did, for both this flow's `mp-flex-logo.png` and the Dashboard's `ad-flex.png` /
  `flex-modal-logo.png`) skips that crop and pulls in the *entire* source graphic, which also
  contains "Pay part now, the rest later" baked in as pixels — duplicating text that's already set
  in real HTML next to it. Fixed by using `get_screenshot` on the specific cropped node
  (`2099:20897` in the Payments file, `2164:6916` in the Dashboard file's Flex modal) instead of
  the raw fill URL, which renders exactly what's visible in that frame (a clean 44×20 "flex"
  wordmark, transparent background) — then reused that same asset across all three call sites
  (Payments summary sidebar ×2, Dashboard footer ad button, Dashboard Flex modal) since they're the
  same brand mark at different sizes. **Lesson for any future Figma image-fill asset**: check
  whether the `<img>`'s width/height in the returned JSX are percentages over 100% (`w-[274.5%]`
  etc.) inside an `overflow-hidden` wrapper — that's the signal the raw asset URL is *larger* than
  what's actually shown, and `get_screenshot` on the containing node (not the raw fill) is the
  correct way to get a pre-cropped export.
- **"Other Amount" input overflowing its card**: the card's text/input content sat in a plain
  `<span style="flex:1;">` with no `min-width: 0`. A flex item's default `min-width` is `auto`,
  which means it won't shrink below its content's intrinsic width — so the `$` input inside kept
  the card's content column pinned to its natural (wider) size instead of shrinking to fit the
  card's fixed `224px`, pushing the input past the card's right border. Fixed by replacing the
  inline style with a real class, `.rmr-pmt-amount-card__content { flex: 1; min-width: 0; }` — the
  standard fix for this flexbox default. Same pattern is worth checking anywhere else a flex child
  wraps a text input.
- **Checkbox rendered as the browser's native widget, not the design system's**: "Save as Your
  Payment Method" and the Terms checkbox both used a plain `<input type="checkbox">` styled only
  with `accent-color`. `accent-color` can only *tint* the OS/browser's own checkbox glyph and
  corner radius — it can't replace its shape or checkmark, so the result looked like a generic
  rounded system checkbox, not the real 20px/2px-radius Checkbox component (node `3006:34891`/
  `3006:34889`) with its filled `--icon-primary` background and the `mp-checkbox-check.svg` glyph
  (downloaded earlier but never wired up for this reason). Fixed with a proper custom-checkbox
  pattern: the native input sits transparently over a `.rmr-checkbox-box` span styled to the real
  spec, and `:checked` swaps the box to `--icon-primary` background + the real check asset — see
  `.rmr-checkbox`/`.rmr-checkbox-box` in `assets/rmr.css`. Reusable for any future checkbox in this
  prototype rather than reaching for `accent-color` again.

## Make a Payment overlay — itemized "Other Amount" and scroll architecture

**"Other Amount" itemized selection**, sourced from node `2175:11880` ("4.3.4 Make A Payment -
Itemized with Overpay", same Figma file): selecting the "Other Amount" card now swaps the plain
read-only charges table for one with a checkbox per row (the same custom `.rmr-checkbox` component
built for "Save as Your Payment Method"/Terms, all checked by default) and editable Pay Amount
inputs, plus an "Overpayment Amount" row. Only that treatment was adopted from the reference frame —
not its 3rd "My Total Balance" card, which stays out of scope per the earlier core-flow decision
(see "Make a Payment overlay flow" above). The reference frame's own numbers come from a different
5-charge dataset than this flow's built total ($1,577.28 across 4 charges); rather than mixing in
its extra "Clubhouse Rental Fee" charge or its $1,597.28/$20.00 example figures, the itemized table
reuses this flow's own charge amounts, so the Overpayment row is `$0.00` by default (mathematically
consistent, not a live recalculation — none of the fields here are wired to real math, same as the
rest of this prototype's faked interactions). Implemented as two parallel `[data-pmt-table]`
elements (`current` / `other`) toggled by the existing amount-card selection handler, rather than
mutating one table's columns in place.

**Scroll architecture fix**: the flow's scrolling was rebuilt so the footer (Continue / Back /
Submit) always reads as a pinned bar with content scrolling behind it, and so the register (charges
table) is the *only* element that ever scrolls horizontally:

- `.rmr-pmt-body` (the row containing the main column + summary sidebar) is now the single
  scrollable region — `flex: 1; min-height: 0; overflow-y: auto` — sitting between the modal's
  header and footer, which are its plain flex siblings and stay outside the scroll. Previously
  `.rmr-pmt-main` and `.rmr-pmt-summary` each scrolled independently while `.rmr-pmt-body` itself
  kept the desktop's `flex: 1; min-height: 0` sizing even in the stacked tablet layout, where its
  real (much taller) content no longer matched that box — the box stayed short, the content painted
  past it anyway (`overflow: visible`), and the footer (next in flow) ended up positioned at the
  box's edge, overlapping that spilled-over content instead of sitting below it. Unifying to one
  scroll region removes the mismatch entirely, at every width.
- `.rmr-modal` now has `overflow-x: hidden`, and the charges table sits inside its own
  `.rmr-pmt-table-wrap` (`overflow-x: auto`) — so a too-narrow width scrolls just the register, not
  the modal. Getting this to actually trigger (rather than silently clipping) needed one more fix:
  in the tablet media query, `.rmr-pmt-body`'s `align-items: flex-start` (the desktop default,
  needed there so the two columns don't stretch to match each other's height) sizes a
  `flex-direction: column` container's children to their own natural content width instead of the
  container's available width — so `.rmr-pmt-main` was sizing itself to the register's full
  intrinsic width rather than shrinking to fit, and since the modal clips (not scrolls) horizontal
  overflow, the excess was invisible rather than reachable. `align-items: stretch` in that same
  media query fixes it: `.rmr-pmt-main` fills the real available width, so it's the inner
  `.rmr-pmt-table-wrap` that overflows (and scrolls) instead.
- Net effect: `.rmr-modal--payment` still goes full-width with `height: auto` under
  `max-width: 1024px` (the modal's own `max-height: 90vh` + `overflow-y: auto` bounding it), and
  `.rmr-pmt-body` stacks to a single column there — same as before — but no longer needs its own
  per-breakpoint height/overflow overrides, since the unified scroll region handles any content
  height automatically. The Success overlay (`.rmr-modal--narrow`, 400px) already fit this width
  without changes.
- One behavior change from the earlier build: on desktop, the summary sidebar no longer stays
  independently pinned while only the main column scrolls (e.g. during the New Payment Method
  expansion) — both now scroll together as the one `.rmr-pmt-body` region, consistent with the
  "footer pinned, content scrolls behind it" pattern at every width instead of a desktop-only
  special case.

## Correction: only one payment method is ever on file

The pg2 "Your Payment Method" step of Make a Payment was originally built as a radio choice
between the existing Visa and a blank "New Payment Method" card (sourced from node `2043:15963`'s
own two-row list plus the blank form at `2043:17085`). Per instruction, that's wrong for this app —
**a tenant only ever has one payment method on file**, so there's nothing to choose between. Fixed
to match the pattern already built for AutoPay setup and the Payment Settings page: a single
`.rmr-ap-method-row` showing "Visa ending in 1234" with an edit pencil, which expands the *same*
real, pre-filled "Edit Saved Payment Method" form (node `2045:7618`, Samantha Carpenter's actual
on-file values) in place — not a blank add-new form. The blank-form interpretation of `2043:17085`
was the actual sourcing mistake here, not just a missing feature; `2045:7618` was the correct
reference all along, as it's the same node AutoPay's own edit-in-place step already used correctly.

Cleaned up as dead code once nothing referenced it any more: `.rmr-pmt-method-list`,
`.rmr-pmt-method`/`--selected`, `.rmr-pmt-method__label`, `.rmr-pmt-new-method`/`--selected`, and
the `pmt-select-method` JS handler (`.rmr-pmt-method__icon` is still used, reused directly by the
new method row). Also caught and fixed a real bug from `.rmr-ap-method-row`'s edit-toggle button
now existing on multiple modals in the same page (Make a Payment's pg2, AutoPay setup, and Payment
Settings' Payment Methods modal all use it): the shared `ap-toggle-edit` handler looked up
`document.querySelector('[data-ap-edit-form]')` unscoped, so clicking any edit pencil always
toggled the *first* such form in the page rather than its own modal's form. Fixed by scoping the
lookup to `btn.closest('.rmr-modal')`.

**The Terms checkbox and summary sidebar should read as part of the pinned footer, not as
scrolling content.** Per instruction, on the "Your Payment Method" step (both `pay-method` and
`autopay-method`), only the method row / expanded edit form should scroll — the Terms checkbox,
the gray summary card, and the footer buttons should all stay visible at all times, the same way
the footer already did. This is a step further than the earlier "footer pinned, content scrolls
behind it" fix, which scrolled `.rmr-pmt-body` (main *and* summary together) as one block — correct
for the other steps, but not what was wanted here, where summary and the checkbox need to stay
visible independent of how much the method column scrolls. Implemented with new modifier classes
scoped to just this step, rather than changing the shared `.rmr-pmt-body`/`.rmr-pmt-main` rules
(which the other steps still rely on): `.rmr-pmt-body--split` turns off the body-level scroll,
`.rmr-pmt-main--pinned-footer` gives `.rmr-pmt-main` a real height (`100%`) to work with now that
`.rmr-pmt-body` isn't doing that job, and the new `.rmr-pmt-scroll` wrapper (holding just the title
+ method row + edit form, with the Terms checkbox as its non-scrolling sibling) is the one thing
that actually scrolls. Applied to all three copies of this step (Make a Payment's `pay-method`,
and `autopay-method` duplicated into both `payments.html` and `payment-settings.html`).

**Follow-up**: the Terms row was still confined to the main column's width (leaving the space
under the summary sidebar empty), and the sidebar itself sat at its own natural (short) height
instead of matching the column next to it. Fixed by moving `<label class="rmr-pmt-terms">` out of
`.rmr-pmt-main` entirely — it's now a direct sibling of `.rmr-pmt-body`, between it and
`.rmr-pmt-footer`, so its existing `width: 100%` spans the *whole* modal (not just the main
column) the same way the footer already does. And `.rmr-pmt-body--split` now sets
`align-items: stretch` (was the inherited `flex-start`), so `.rmr-pmt-summary` stretches to match
`.rmr-pmt-main`'s full height instead of sitting shorter than it.

**Correction: the edit form replaces the method row, it doesn't expand below it.** Re-checked
against a screenshot of node `2045:7618` directly and found two real discrepancies from the actual
reference, not just polish:
- The "Edit Saved Payment Method" card is **one continuous bordered/tinted box** (same
  `--component-selector` background + `--border-button-tertiary` border as the plain method row),
  and it **replaces** "Visa ending in 1234" entirely while editing — the row and the form are never
  both visible at once. The earlier build showed the plain row *and* a separately-boxed (in an
  earlier pass) or unboxed (after the dead-code cleanup for "only one payment method," which
  stripped the wrapper that used to carry this styling) form stacked below it — an artifact of
  reusing the old "radio list + expand" structure's DOM shape after the radio list itself was
  removed. Fixed in both HTML (`ap-toggle-edit` now toggles `[data-ap-method-row]` too, hidden
  exactly opposite of `[data-ap-edit-form]`) and CSS (`.rmr-pmt-new-form` carries the
  border/background/padding directly now, and picked up the same `[hidden]` override
  `.rmr-ap-method-row` needed but didn't have — the same recurring "class's own `display` beats the
  browser's default `[hidden]` style" bug as everywhere else in this file).
- The "Payment Method" select is a fixed **~240px** field (matching the Max Amount/Card Number
  field width used throughout this design system), not stretched to the form's full width. Fixed
  with `max-width: 240px` on its `.rmr-pmt-field` wrapper, in all four places this form appears
  (`pay-method`, `autopay-method` ×2, and the Payment Settings page's own Payment Methods modal,
  which uses the identical pattern).

## AutoPay setup flow

Sourced from file `fPSZy4e0NwJMiTs345xXGy`, section "Autopay setup" (node `2001:1682`, 9 frames).
Reachable from the Balance Due AutoPay banner's empty state (its "Set Up" button) and from the
Payment Settings page's "AutoPay" row. Built as a 3-step wizard, mirroring the Make a Payment
flow's own structure and CSS scaffolding (`.rmr-pmt-body`/`-main`/`-summary`/`-field`/`-footer`/
`-new-form`/`-success` are all reused directly, since both flows share the same underlying
design-system components):

| Step | Overlay | Node ID |
|---|---|---|
| 1 | Payment Amount + Autopay Schedule | `2044:20657` ("Reference: Schedule Autopay - pg1 Balance"), its "Specific Amount" radio state from `2044:22220` |
| 2 | Your Payment Method | `2044:22955` ("5.2.1 Autopay - pg 2 Pay Method CC"), its edit-in-place form from `2045:7618` ("Reference: Schedule Autopay - pg 2 Replace Pay Method") |
| 3 | Success | `2005:4482` ("5.1.5 Autopay - Success") |

Two small layout bugs caught after building this and the itemized "Other Amount" table:
- **Overpayment Amount row misaligned**: that row only had 5 `<td>`s while the itemized table has 6
  columns (checkbox, Date, Type, Details, Charge Amount, Pay Amount) — added for the "Other Amount"
  checkbox treatment above. Missing the checkbox column's own empty cell shifted every value in that
  row one column left, landing the input under Charge Amount instead of Pay Amount. Fixed by adding
  the missing `<td></td>`.
- **Inline icon dropping to its own line**: `img { display: block; }` is a global reset (avoids the
  default inline-image baseline gap), but it also means any icon meant to sit inline *within a line
  of text* — not inside its own flex row — forces a line break, since block boxes always start on a
  new line. Hit this on the Max Amount field's info icon and the Payment Summary's "Powered by
  flex" logo (`.rmr-pmt-flexad__logo`), both plain text + `<img>` inside a `<span>`/`<p>` with no
  flex wrapper. Fixed by giving each `display: inline-block` (which still honors `vertical-align`
  and explicit width/height, unlike plain `inline`). Elsewhere in these flows the same icon+text
  pattern already sits inside a `display: flex` label (`.rmr-pmt-field__label`, `.rmr-ap-method-row
  __info`, etc.), which is unaffected — flexbox lays out its items by flex rules regardless of the
  item's own inline/block nature, so this bug only shows up for icons inside plain inline text flow.

**Scope decisions** (made without checking in, per instruction — flagging them here rather than
silently deciding):
- The ACH and "no card on file" pg2 variants (`2044:23491`, `2099:45364`) were left out, same
  precedent as Make a Payment's own ACH/No-Card exclusion.
- A standalone "Autopay is disabled" toggle frame (`2045:15670`, "5.1.1 Autopay - disabled" — just
  a message + an Enable AutoPay toggle, no footer/Continue in its own metadata) was **not** used as
  a first step. The empty banner's own "Set Up" button already states clear intent, so it opens
  directly into step 1 — an extra "are you sure you want to enable this" toggle screen in between
  would be redundant. That frame may be what the Payment Settings section's own disabled/empty
  AutoPay states show instead (see below) — not built here.
- The pg2 edit-in-place form reuses Make a Payment's "New Payment Method" form scaffolding
  (`.rmr-pmt-new-form`), but its real content differs — this one is genuinely a **pre-filled**
  "Edit Saved Payment Method" state (Samantha Carpenter's actual on-file values: card `32452341234`,
  exp `12/27`, `742 Willow Crescent, Apt 3B`, Loveland OH 45208), not a blank "New Payment Method"
  form, and its header includes "Clear All Fields" (not a "Save as Your Payment Method" checkbox)
  plus its own local Cancel Changes/Save buttons distinct from the page-level footer.
- The Success screen's own numbers (Nov 1, `$2,000`, "Ending in 1234") come directly from node
  `2005:4482` and were kept as-is rather than reconciled with the Balance Due banner's already-built
  "AutoPay Scheduled" numbers (Dec 1, `**4534`) — same "don't force-merge data across independently
  -authored frames" precedent as the tablet frame note above. The Payment Settings page's AutoPay
  row (below) has its own third set of numbers for the same reason (`**1234`, Dec 1) — sourced
  directly from *its* own frame.

**Empty AutoPay banner state**: sourced from node `2312:46143`, a sibling of the already-built
"AutoPay Scheduled" banner (`2214:17011`) on the Balance frame — same `.rmr-pay-autopay` scaffolding,
blue accent bar (`--icon-primary`) instead of green, "Set up AutoPay" / "Never worry about missing
payments!" / a "Set Up" secondary button. This prototype now defaults to showing this **empty**
state (rather than "AutoPay Scheduled") so the flow's own entry point is reachable, and swaps to the
Scheduled banner once the wizard's "Schedule" button is clicked — a real state change, not just a
click-through, same spirit as the Make a Payment button already routing to a real flow.

**Fixed-height modal, not auto**: `.rmr-modal--autopay` originally set only a `width` (`948px`),
leaving height to size to content — unlike `.rmr-modal--payment`, which has always had an explicit
`height: 608px` matching its own Figma frame. That auto-height left `.rmr-pmt-body`'s `flex: 1`
with no real leftover space to grow into on short-content steps like "Your Payment Method" (just
one payment method row + Terms checkbox), so the footer ended up sitting inconsistently relative to
the content instead of anchored at a predictable bottom position. Gave `.rmr-modal--autopay` an
explicit `height: 566px` (matching the pg1/pg2 Figma frames, which are 566px/560px) to remove the
ambiguity outright — now every step is a consistent, Figma-accurate size with the footer always at
the same bottom position and content (including the summary sidebar) always above it, and taller
content (the expanded edit form) still scrolls internally exactly as before. Also added
`.rmr-modal--autopay` to the tablet breakpoint's existing `width: 100%; height: auto` override
(previously scoped only to `.rmr-modal--payment`) so it still stacks to a natural, non-fixed height
at narrow widths, matching Make a Payment's own tablet treatment.

## Payment Settings page

Sourced from file `fPSZy4e0NwJMiTs345xXGy`, section "Payment Methods" (node `2001:1751`) — a much
larger section than it first appears: 16 frames covering a full Payment Settings page family
(Payment Settings empty/entered, Payment Methods new/entered/edit-entered, Autopay disabled/new/
scheduled/edit-scheduled, and 5 confirmation dialogs for unsaved changes/turning off Autopay/
deleting a payment method). Given the size, this prototype builds:

- **The landing page** (`screens/payment-settings.html`), from frame "3.1.2 Payment Settings -
  Entered" (node `2039:14660`): the compact photo hero (`2039:14665`, a 64px real-photo banner with
  the `--background-element` overlay token — different from the full-bleed two-image hero pattern
  used on Dashboard/Payments) + one card with two rows, "Payment Methods" (Visa ending in 1234) and
  "AutoPay" (a green "On" lozenge + "Scheduled Dec 1, 2025 up to $2000 with **1234", its own
  numbers straight from this frame), each with a chevron-right.
- **The "Payment Methods" row links to a real page** (`screens/payment-methods.html`), not a
  modal — corrected after first building a scoped-down modal stand-in for it, once the user pointed
  at node `3272:27066` and confirmed the section's separate full-page Payment Methods states are
  what should actually be built:
  - **View state**, from "3.2.2 Tenant Payment Methods - Entered" (node `2099:7654`): plain
    label-and-value text for Payment Method/Card Number (masked `XXXXXXXXXXXX1234`)/Expiration
    Date, and Billing Information — Edit (pencil) and Delete (trash, a newly-downloaded icon) sit
    top-right of the "Your Payment Method" card. **Correction**: an earlier pass rendered these as
    `readonly` `.rmr-modal__input` fields, i.e. the same bordered/boxed look as the Edit state's
    real inputs — checked against a screenshot of this exact node and found the source has *no*
    border or box on the view state at all, just bare text under each label (the "Input field"
    wrapper in the underlying JSX for this state genuinely has no `bg`/`border` classes, unlike the
    edit state's own version of the same wrapper, which does — a distinction missed on the first
    pass). Fixed with a new borderless `.rmr-pmm-value` class instead of reusing `.rmr-modal__input`
    for both states.
  - **Edit state**, from "3.2.3 ... Edit Entered" (node `2045:418393`): swaps in on the pencil click
    — a Bank Account/Card method-type choice (two selector cards, same pattern as
    `.rmr-pmt-amount-card`; a new `account-balance.svg` icon for the unselected Bank Account
    option), the same fields now editable and the Card Number unmasked, a "Use Address on File"
    link, and a footer with Terms checkbox + Zego Privacy Policy + Cancel + **Save, disabled by
    default** (the source's own `State=Disabled` variant, `--component-button-disabled: #82b3ed`) —
    wired to enable only once Terms is checked, matching the implied real behavior rather than
    leaving it permanently disabled or permanently enabled.
  - The hero has a real "Back to Payment Settings" button (node `2118:9986`'s own content), so the
    page reads as a drill-down from Payment Settings rather than a dead end.
  - The source's `Caprenter` (not "Carpenter") for Last Name is a genuine typo in the Figma content
    itself, kept as-is rather than silently corrected — same "nothing invented, including fixing
    what looks like someone else's typo" discipline as elsewhere in this file.
  - Not built as its own screen: the "New" (no payment method yet) state (`2081:11170`) — not
    reachable for this persona, who already has a card on file — and the standalone
    unsaved-changes/delete-confirmation dialogs from the wider section (`2140:10589`, `2150:24721`,
    `2153:10565`) — Delete and Cancel act directly in this prototype, without an intermediate
    confirmation step. The decorative `rmRP bg` line-art watermark visible behind the card in Figma
    was also skipped as a minor visual flourish, not core content.
  - **Bank Account / Card field swap**: the Edit state's two method-type selector cards only
    toggled their own selected styling at first — clicking "Bank Account" left the Card-only fields
    (Payment Method/Card Number/Expiration Date/Security Code) showing underneath regardless of
    selection. The Edit Entered frame (`2045:418393`) only ever shows Card selected, so it has no
    real Bank Account field set of its own; node `2081:11170` ("3.2.1 ... New" / "Add a Payment
    Method") is the one frame in this section that actually renders Bank Account selected, so its
    field set was pulled in as the real source: Account Type (select, "Checking"), Account Number*,
    Confirm Account Number*, and Routing Number* (each starting blank, matching that frame, rather
    than reusing the Card fields' pre-filled values) — Routing Number carries a trailing info icon
    next to its *label*, the `InputField` component's `showInfo` prop, which is a different pattern
    from the Security Code field's icon sitting *inside* the input. `data-method-type` on each
    selector card now drives which `[data-pmm-fields]` row is shown. Two incidental differences from
    the `2081:11170` source were deliberately left alone rather than copied over: its Billing
    Information layout omits Country and reorders Street into the first row (vs. the Edit Entered
    frame's First/Last/Country + Street/City/State/Postal layout used here), and its Save button
    isn't shown disabled-by-default — both read as artifacts of it being a different frame (a
    from-scratch "add a method" form) rather than an intentional per-type variation of *this* Edit
    state, so the Billing layout and the Terms-gated Save behavior stay shared across both method
    types.
  - **Select focus state was a browser default, not the design system's**: `<select>` fields (e.g.
    the new Account Type dropdown) had no `:focus` rule of their own, so they fell back to the
    browser's native focus ring — rendered as a yellow/orange outline that paints outside the
    element's box and visually overlapped the next field's label. Checked the real "Input Field"
    component (design system file `W4wEUn8A4hkTdiAgEV8wSK`, node `12:1116`) for its actual
    `State=Selected` treatment: no outline at all, just `background: var(--component-selector)` +
    `border-color: var(--border-button-tertiary)` — the same tint/border pair already used for every
    other "selected" surface in this prototype (radio dots, method-type cards, the edit-form box).
    `.rmr-modal__input`/`.rmr-modal__textarea`'s own focus style was an earlier, un-sourced
    `outline: 2px solid var(--icon-primary)` guess; replaced all three (`input`, `textarea`,
    `select`) with the real sourced treatment for consistency.
  - **Every dropdown's open list is now the real "Dropdown" component, not OS chrome.** The fix
    above only reaches a `<select>`'s own closed-field box — its open option list is rendered by
    the browser as native, unstylable OS UI, so it could never actually match the design system no
    matter what CSS was applied to the `<select>`/`<option>` elements themselves. Per request, every
    `<select class="rmr-modal__select">` across the prototype (Payment Method, Country, State,
    AutoPay's Frequency/Day of Month, this page's Account Type — 17 in total) was rebuilt as a
    trigger button + an absolutely-positioned menu, using the design system's actual "Dropdown"
    component (file `W4wEUn8A4hkTdiAgEV8wSK`, node `12:1560`/`12:1637` — the same row also used
    inside the Input Field's Year/Month pickers): `min-height: 40px`, `padding: 8px 8px 8px 16px`,
    14px Lato Regular, `Default` (no fill) / `Hover` (`--interaction-hover-blue`, `#f6fafe`) /
    `Selected` (`--interaction-selected-blue`, `#dbe9fa`) row states. The closed trigger keeps
    `.rmr-modal__select`'s exact existing box/chevron/focus styling (nothing invented there), so the
    field looks identical until it's opened. Every instance still has exactly one option, same as
    the native selects they replaced — this is a visual fix, not new functionality. One real
    regression surfaced during testing: unlike a native `<select>`'s OS-level popup, this menu is a
    normal in-flow descendant, so a scrolling ancestor (e.g. the Make a Payment/AutoPay method
    step's `.rmr-pmt-scroll`) clips it like any other overflowing content when the field sits near
    the bottom of the scroll region. Fixed by measuring the nearest scrolling ancestor (falling back
    to the viewport) on open and flipping the menu above the trigger (`.rmr-dropdown--menu-up`) when
    there isn't room below.
  - **Payment Method/Country/State now have real option lists, by explicit request** — every
    instance of these three dropdowns previously had exactly one `<option>`, matching what Figma
    ever shows selected (the mocks never depict these fields open with alternatives). Per direct
    instruction, Payment Method gained a second "Debit Card" option, Country was filled with a
    standard list of common billing countries (United States first/selected, then Canada, Mexico,
    UK, Australia, Germany, France, Italy, Spain, Netherlands, Ireland, New Zealand, Japan, China,
    India, Brazil, South Korea, Sweden, Switzerland, Other), and State with the real 50 states + DC
    (Ohio selected, matching the existing address). This is reference data the user asked for
    directly, not something read off a Figma frame — the "nothing invented" rule is about design
    (color/spacing/icons/copy), not standard list content a user explicitly requests.
  - **Scroll bar restyled to the design system's real "scroll bar" component** — the browser's
    default scrollbar on `.rmr-pmt-scroll` rendered wider than spec and with its own OS-drawn edge,
    reading as a bounded/boxed element sitting flush against the bordered "Edit Saved Payment
    Method" card. Checked the actual "scroll bar" component (file `W4wEUn8A4hkTdiAgEV8wSK`, node
    `308:2151`, also visible in the `Navigation` (list controls) section at `134:2342`): an 8px-wide
    rounded track (`--border-border`) with a rounded thumb (`--icon-disabled`) inside it, no border
    on either. Restyled via `::-webkit-scrollbar` to match, and added `padding-right:
    var(--spacing-xs)` (8px) on the scroll container so the bordered card has real clearance from
    the bar instead of touching it. Also re-checked the 24px gap between the two columns
    (`.rmr-pmt-body`'s `gap: var(--spacing-xl)`) against this same node's `Payment Container` — it
    already matches Figma's own `gap-[var(--spacing/xl,24px)]` exactly, so no change was needed
    there.
- **Correction: the AutoPay row links to a real page, not a modal.** It originally reused the
  AutoPay setup wizard (same 3 modals duplicated onto this page, matching the Balance Due banner's
  own entry point) — cheap reuse, but wrong once the user pointed at node `3276:27067` and showed
  this section is its own family of full pages, same shape as the earlier Payment Methods
  correction. The duplicated modals were deleted; see "AutoPay page" below for what replaced them.
- **Not built**: the standalone unsaved-changes/turn-off-Autopay confirmation dialogs
  (`2164:640465`, `2153:16770`) and the Current Convenience Fees frame (`2538:57076`) — the AutoPay
  flow's own close button just closes directly in this prototype, without an intermediate
  confirmation step. (These belong to the Balance Due banner's own wizard, which is unchanged.)

## AutoPay page

Sourced from file `fPSZy4e0NwJMiTs345xXGy`, section "Autopay" (node `3276:27067`) — a separate
family of full pages from the AutoPay setup *wizard* (the modal flow reachable from the Balance Due
banner stays as its own, unrelated thing). Four frames:

- **Disabled**, from "3.3.1 ... disabled" (node `2081:30176`): "AutoPay is disabled" + description
  + a Toggle Slider ("Enable AutoPay", off). This is the default state.
- **Scheduled**, from "3.3.3 ... Scheduled" (node `2098:11969`): "AutoPay is enabled" + the toggle
  on, plus a second, borderless card — a compact summary (You will pay/Up to/Payment Method, then
  Frequency/Day of Month/Starting on/Ending on), a disclaimer, and an edit (pencil) icon top-right.
- **New** (node `2099:43692`) and **Edit scheduled** (node `2081:30885`) are combined into one
  `[data-ap-edit-card]` section, reachable either by turning the toggle on for the first time or by
  the Scheduled card's pencil. The two Figma frames differ only in whether the payment method
  starts as an open card-entry form (New, since nothing is saved yet) or a collapsed row + pencil
  (Edit scheduled) — the collapsed-row treatment was used for both here, same as everywhere else in
  this prototype, since this persona always has exactly one saved method (see "Correction: only one
  payment method is ever on file" above). Its fields (Payment Amount radios + Max Amount, Frequency/
  Day of Month/Start Date/End Date, the Payment Method edit-in-place card, and the Summary) are the
  exact same content and markup already built for the AutoPay setup wizard's own two steps — reused
  verbatim rather than re-authored, since it's the same real fields either way.
- The Toggle Slider itself is a new component (design system file `W4wEUn8A4hkTdiAgEV8wSK`, node
  `3006:32095`/`3006:32096`): a rounded track (`--component-toggle-switch-disabled` off /
  `--component-button-primary` on) with a sliding circular handle, a check icon appearing only when
  on. `.rmr-toggle`, added to `rmr.css`.
- **Cross-page state**: per instruction, this page defaults to disabled *unless AutoPay has already
  been scheduled from the Balance Due banner's own wizard* — and saving AutoPay here should likewise
  carry over to that banner and to the Payment Settings row. A static multi-page prototype has no
  server session to hold that, so it's the one place in this app that reaches for `localStorage` (a
  single flag, `rmr-autopay-scheduled`): written whenever AutoPay is completed from *either* entry
  point (this page's Save, or the wizard's "Schedule" button), and read on load by this page, the
  Balance Due banner, and the Payment Settings "AutoPay" row (now two toggleable link states,
  `data-autopay-row-state="empty"/"scheduled"`, mirroring the banner's own pattern) to decide their
  starting state. Turning the toggle off here clears the flag.
- **Not built**: the standalone unsaved-changes/delete-autopay confirmation dialogs implied by the
  wider section (not present as separate frames in this metadata pull) — Cancel and the toggle just
  act directly, same precedent as the setup wizard and Payment Methods page.
- **Correction: the edit/setup card's Summary belongs in its own gray column on the right, not
  stacked inline below the form.** The first pass put "You will pay"/"Every month starting on" as
  plain rows at the bottom of the same single white card as the rest of the form, with the Terms
  checkbox and Cancel/Save stacked as separate lines below that — all of it just inheriting
  `.rmr-settings-card`'s own `gap: var(--spacing-xl)` between every child, major sections and footer
  alike. Checking node `2099:43692` ("New") again: the real layout is two columns — Payment Amount/
  Schedule/Payment Method on the left, and a *separate, shaded* `Summary Container` (same
  `.rmr-pmt-summary` component already built for the AutoPay wizard's own summary sidebar — gray
  `--background-secondary`, bordered, its own divider + disclaimer inside the box) on the right —
  then the Terms checkbox and Cancel/Zego/Save sit together in one full-width row underneath both
  columns (Figma's own "Buttons Right" frame), not stacked on separate lines. Rebuilt using
  `.rmr-pmt-body` (with `flex`/`min-height`/`overflow-y` reset via inline style, since this page
  isn't a modal and shouldn't get its own inner scroll region) for the two-column/gray-sidebar
  split, and `.rmr-pmm-footer` (already used for this exact checkbox+buttons row on the Payment
  Methods page) for the footer. Re-checked the other three places with a similar checkbox+footer
  pattern (Make a Payment, the AutoPay wizard, Payment Methods) against this same question and their
  spacing was already correct — this was specific to the new inline page.

## Account Settings

Sourced from a different Figma file than the rest of this prototype —
`GHtjX6TVj9OpVUXTyShguj` ("RMR Rewrite — Account Settings"), section 1 (node `2693:6479`) —
reached from the header's "View Account" menu item (previously a `fake-submit` stub; now a real
link on every screen). This section has 15 top-level frames; per instruction, all of them were
built. Auth note: the Figma MCP connector's session auth didn't carry over to background
subagents (they hit an "unauthenticated" error immediately), so after an initial attempt to
parallelize the research across agents, the remaining fetches were done directly in this session.

**One real page** (`screens/account.html`) with 4 tabs (node `2568:7276`'s own tab bar — see the
"stale tab bar" note below) and 6 modals, plus **one standalone page**
(`screens/verification-sent.html`, no app chrome, reached from Change Username):

- **Details tab** (node `2568:7276`, the "3.1.0 Account Details" frame used as authoritative —
  see the superseded-drafts note below):
  - **Account Details** section: Username (`scarpenter@gmail.com`) / Password (masked), plus a
    kebab (⋮, `more_vert`) menu opening **Change Username**, **Change Password**, and **Delete
    Account** as modals.
  - **Personal Information** section: description + First Name/Last Name/Phone Number, edit
    pencil opens the **Personal Information** modal (node `2548:8808`) — the same three fields,
    now editable.
- **Contacts tab** (node `2568:7497`): a single "Contact Information" card (Name/Email
  Address/Cell Phone "(primary)" baked into the value text/Employer), edit pencil opens the
  **Contact Information** modal (node `2179:12188`) — Name plain-text, Email/Employer bordered,
  plus a repeating Phone Numbers table (Phone Number/Phone Type dropdown/Primary Phone radio/
  delete icon) and an "+ Add Phone Number" link. Despite the plural name, this tab shows exactly
  one contact record, not a list of multiple people — the only multiplicity is in that one
  contact's phone numbers.
- **Settings tab** (node `2001:1039`): "Community Directory Settings" — a Toggle Slider ("Display
  my name and address in community directory", on) gating two indented checkbox+field rows
  ("Include Phone Number" / "Include Email", both checked, each with its own value shown inline).
  Turning the toggle off hides the two sub-rows (`data-acct-directory-options`).
- **Linked Accounts tab** (node `2003:4143`): a "Link Additional Account" button (opens the modal
  from node `2179:25080` — a single "Account #" field, body copy naming the account email) above a
  table (Default radio / Account # / Account Name / an *editable* Display Name input) and a
  "N Linked Accounts" footer count. No per-row remove control in the source — only the radio and
  the Display Name input are interactive.
- **Delete Account** (node `2179:12688`) uses a different, simpler dialog shape than the other
  modals — Figma's "Modal Dialog" component (node `2315:14882`): no header/close-X, instead an
  icon + bold question ("Are you sure you want to permanently delete this account?"), a body
  paragraph, a "Confirm Current Password" field, and right-aligned Cancel/Delete Account buttons.
  Built as `.rmr-acct-confirm` rather than reusing the standard `.rmr-modal__header` pattern.
- **Change Username** (node `2179:10456`) warns the user will be signed out and asked to verify a
  new email; its "Send Verification Email" is a real link to `verification-sent.html`, not a
  fake-submit — this is the one place in the whole prototype where a modal action navigates to a
  genuinely different page rather than just toasting or closing.
- **Change Password** (node `2179:11729`) has a live-looking password requirements checklist
  (5 items, check/x icons) — kept exactly as the source shows it (4 satisfied, "Passwords must
  match" unsatisfied) rather than wiring it to actually validate the (fake) input, consistent with
  every other form in this prototype being pre-filled/static rather than functionally validated.

**Stale tab bar across frames**: the Details frame (`2568:7276`) and its matching Contacts frame
(`2568:7497`) both show 4 tabs (Details/Contacts/Settings/Linked Accounts), but the separately
fetched Settings frame (`2001:1039`) and Linked Accounts frame (`2003:4143`) each only show 3
(no Contacts tab) — an inconsistency in the source file itself (frames edited at different times),
not a deliberate per-tab difference. Built one unified 4-tab bar applied consistently, since the
alternative (Contacts unreachable from 2 of the 4 tabs) reads as an oversight in those two frames
rather than an intended restriction.

**Four superseded "Account Details" draft iterations** (nodes `2528:5106`, `2529:5507`,
`2539:5827`, `2548:6133`) exist in the same file, each an earlier pass at this same page (visible
progression: one big "Account Details" section → split "Login Credentials"/"Account
Details"/"Contact Information" sections with only 3 tabs → the final 4-tab version with a
dedicated Contacts tab actually used here). Not built — node `2568:7276`'s version is the most
recent and the only one self-consistent with the dedicated Contacts tab frame.

**Icons downloaded this section** (`assets/icons/account/`): `more-vert.svg` (kebab),
`visibility.svg` / `visibility-off.svg` (password show/hide, cosmetic only — no real toggle
behavior since these are static demo fields), `req-check.svg` / `req-x.svg` (password requirements
list), `error-outline.svg` (Delete Account's lead icon). The "Add Phone Number" `+` glyph is a
small inline SVG (not exported from Figma) — a plain two-line plus shape, per the icon-currentColor
convention already used for the sidebar nav icons, rather than a spent research cycle chasing one
trivial universal glyph.

**Not built**: nothing — this was the "everything in this section" scope. No standalone
unsaved-changes/confirmation dialogs turned up in this section's own metadata pull the way they
did in Payments/AutoPay, so none were skipped here.

## Payments & Charges — responsive (tablet) behavior

Sourced from the "Payments Tablet" frame (`node 2828:23259`, same Figma file). At `max-width:
1024px` (rmr.css, near the bottom):

- The sidebar auto-collapses to icon-only (same visual treatment as the manual Collapse toggle),
  regardless of the toggle's own state.
- The Balance/AutoPay card and the charges table stack into one column instead of sitting side by
  side.
- The ledger table drops its **Late Fee** column and "Reference Number" shortens to "Ref #".
- **Correction — "Your Payment Method" step's split-scroll layout didn't survive the stack.** The
  Make a Payment/AutoPay overlays' pg2 step uses a desktop-only split (`.rmr-pmt-body--split` /
  `.rmr-pmt-main--pinned-footer` / `.rmr-pmt-scroll`, see the Make a Payment section above) so the
  method/edit-form column can scroll on its own inside a *fixed* 608px modal while the summary
  column stretches to match it. At the tablet breakpoint the two columns stack into one instead,
  and that split no longer made sense once stacked: `.rmr-pmt-main`'s `height: 100%` was resolving
  against a bounded ancestor from the (unrelated) 90vh modal fallback, giving the edit form a
  short, truncated internal scrollbar that cut it off after a couple of fields, while the summary
  sat beneath it fully unclipped and un-scrollable — backwards from what the layout should do at
  this width. Undoing the split at this breakpoint (`.rmr-pmt-body--split` back to `overflow-y:
  auto`, `.rmr-pmt-main--pinned-footer` back to `height: auto`, `.rmr-pmt-scroll` no longer its own
  scroll region) restores the plain single-scroll-region behavior every other step already gets
  from the base `.rmr-pmt-body` rule, so the edit form and summary now scroll together as one block
  beneath the pinned header/Terms/footer. Doing this also surfaced a second, previously-masked bug:
  `.rmr-pmt-main`'s own `flex: 1` (flex-basis 0%) was left in place, and once its sibling
  `.rmr-pmt-summary`'s natural height alone exceeded the stacked column's available space there was
  no positive free space left to grow into — the main column was collapsing to 0px and rendering
  its fields on top of the summary below it instead of pushing it down. Added `flex: none` to
  `.rmr-pmt-main--pinned-footer` at this breakpoint so it sizes to its own content like a plain
  block, which fixed the overlap.

The Figma frame is a fixed-width tablet artboard, not a stated breakpoint — 1024px (the
conventional tablet cutoff) was chosen so the adaptation actually triggers responsively while
resizing, rather than only matching one fixed width. The tablet mock's own Balance card shows
slightly different placeholder numbers (3 charge items instead of 4, no "Per Day Late Fees") and
a different ledger table — since these read as incidental drift between two independently-edited
Figma frames rather than a deliberate tablet-specific content change, the desktop screen's already
cross-verified numbers were kept rather than adopted. The All Activity table's Late Fee column is
hidden the same way for consistency, though the source tablet frame only shows the Open Charges
state — if a real tablet mock of All Activity turns up, check it against this.

## Overlays on the Dashboard

The Dashboard section in Figma also contains five overlay/modal frames, now wired up and built
from their real `get_design_context` content (not the earlier placeholder pass):

| Trigger | Overlay | Node ID |
|---|---|---|
| Blue **Need Renters Insurance?** ad banner | Lease Track | `2164:6996` |
| Purple **Pay part now, the rest later** ad banner | Flex | `2164:6997` |
| Footer **Contact Us** | Contact Us | `2167:7284` |
| Footer **Email Property Manager** | Email Property Manager | `2279:15651` |
| Footer **Cash Pay Information** | Cash Pay | `2241:1013` |

All five are in file `hbQDUSRF1dLm35tCQAWeHQ`. The modal chrome (`.rmr-modal-backdrop`/`.rmr-modal`
in `assets/rmr.css`) is shared scaffolding — click-outside/Escape/X all close it like a real modal
would. Their buttons ("Upload Existing", "Apply Now", "Send Email", etc.) are inert — see below —
except the hero **Make a Payment** button and the "Sign" task button, which route to
`payments.html` / `lease-account.html`.

The backdrop scrim uses the real **Ghosting** component (design-system file, node `386:1000` —
its own Figma description is "For use when underneath a pop up or overlay"), which is the
`Background/Backdrop` token: `rgba(0, 0, 0, 0.5)`. An earlier pass invented a dark-blue-tinted
scrim instead of looking this up — fixed to the real token.

**Correction: the Dashboard's two "Make a Payment" links (hero button + the "Rent is Due" update
row) open the real Make a Payment overlay directly on top of the Dashboard**, not by navigating to
`payments.html` first. The first pass tried to avoid duplicating the 3-modal flow by linking to
`payments.html?open=pay-amount` and auto-opening it there on arrival — cheaper to build, but wrong:
the user explicitly wants the overlay over the *current* page, matching how every other
overlay-triggering button on the Dashboard already behaves (Lease Track, Flex, Contact Us, etc. —
see the table above), not a page transition. Since the Make a Payment flow only exists as a modal
(unlike AutoPay, it was never given its own standalone page — it's fundamentally an overlay per
Figma), the fix is the same duplication pattern used for AutoPay's setup modals early in this
project: the whole `pay-amount`/`pay-method`/`pay-success` flow (same markup, same `data-modal-*`
wiring) is now copied verbatim onto `dashboard.html` too, and both links became
`data-action="open-modal" data-modal-target="pay-amount"` buttons instead of `<a href>`s. The
`payments.html?open=` query-param auto-open mechanism this replaced has been removed from
`app.js` — it had no other caller.

**Dev-preview caching note**: verifying this surfaced that this session's Browser pane preview
aggressively browser-caches `assets/app.js`/`assets/rmr.css` (and even specific already-visited
page URLs) after enough repeat requests over a long session, independent of the local dev server
restarting — a real fresh visitor never hits this, but it made local re-verification unreliable.
Fixed by giving both `<link>`/`<script>` tags a `?v=2` cache-busting suffix across every screen,
which also guards the *published* artifact against a returning visitor's browser holding onto a
stale `app.js` after a republish.

**Not MVP — removed from the Dashboard by request**: the "New Poll" task card (Tasks section) and
the "You have a violation notice for Landscaping" update (Latest Updates) — both were real content
from the Figma frame, but Polls and Violations are already out of scope for this prototype (see
the sidebar's standing 4-tab restriction). The Tasks card header changed from "2 Tasks..." to
"1 Task Needs Your Attention" to match the remaining single task.

## Service Issues (`maintenance.html`)

Built from file `41cZMQjGcwZBmHWS8NggER` ("rmR — Service Issues"), section "Issues Register"
(`2351:21209`). Replaces the earlier `maintenance.html` placeholder.

| Piece | Node ID | Frame name |
|---|---|---|
| Open Issues register | `2351:15179` | 3.1.1 Service Issues Register - Open Issues - w/o MS |
| Closed Issues register | `2351:17327` | 3.1.2 Service Issues Register - Closed Issues - w/o MS |

The "w/o MS" (no maintenance-staff column) register variant was used, matching what was asked for —
the file also has a "w/ MS" register variant (`2351:18024`), deliberately not used.

The register card reuses the same components already built for Payments & Charges and Account
Settings rather than anything new: `.rmr-pay-field` (Date Range), `.rmr-acct-tabs`/`.rmr-acct-tab`
(Open Issues/Closed Issues — confirmed to be the identical "Tabs" component as Account Settings'
underline tabs, just in a new file), and `.rmr-pay-table`/`.rmr-pay-table-wrap`.

**Closed Issues row-count note**: the source frame's footer text reads "Showing 15 of 15 Closed
Issues," but only 10 visually distinct rows exist in the design (one row is duplicated verbatim in
the source). Per this project's standing rule against inventing data, the 10 real rows are rendered
as-is and the footer text is kept exactly as designed rather than fabricating 5 more rows to match
it — same call made earlier for the Payments "All Activity" Late Fee column.

### Correction: Add Service Issue is an overlay flow, not a standalone page

An earlier pass built the Add Issue form from node `2351:21990` ("3.2.5 Add Only," file
`41cZMQjGcwZBmHWS8NggER`) as its own page, `add-issue.html`, reasoning that the frame had no
Ghosting/backdrop layer behind it. Corrected per explicit instruction: "Add Service Issue" opens a
real overlay flow instead, sourced from the same file's section "Add Issue - w/ Maintenance
Scheduling" (node `2792:94769`), which **does** sit behind Ghosting. `add-issue.html` was deleted;
the flow now lives entirely as modals on `maintenance.html`.

| Step | Node ID | Frame name |
|---|---|---|
| 1. Form | `2407:6415` | 3.3.1 Add Issue - w/ MS & custom form |
| 2. Schedule (before/after slots picked — one screen, two states, not two steps) | `2438:32062` / `2438:32572` | 3.3.2 / 3.3.3 Add Issue - MS 1 / MS 2 |
| 3. Confirmation | `2438:33123` | 3.3.4 Add Issue - MS Confirmation |

This supersedes the earlier "3.2.5 Add Only" build: that frame's own fields (a Phone Number row,
no Category options visible) don't match this flow's real content, so the fields below replace it
rather than merge with it.

- **Step 1 fields** (all real, from node `2407:6415`): Issue, Category (dropdown; the frame shows
  only "Other" selected, no option list — same "no real options in source" situation as the earlier
  build, so it stays a non-functional `fake-submit`-styled trigger rather than inventing category
  names), Description, "Has this happened before?", an Attachments dropzone, "Will there be pets or
  service animals on the premises?", "Is technician allowed to enter if tenant is not present?". The
  emergency-number banner text and every field label are transcribed verbatim from the frame.

  **Correction: the form starts blank, not pre-filled.** An earlier pass pre-filled every field with
  the frame's own example content (issue text, description, Yes/No answers, and the Attachments
  dropzone's 6-file example), reasoning by analogy to other "Add new X" forms in this prototype
  (e.g. Payment Methods' add-card form) that start pre-filled. Corrected per explicit instruction —
  Add Service Issue now starts genuinely empty: Issue and Description blank (no invented placeholder
  copy, matching how e.g. Email Property Manager's blank fields are handled elsewhere in this
  prototype), Category showing a neutral "Select a Category" prompt in the same muted placeholder
  color already used for date-format hints (`--text-accent`), neither Yes/No option pre-selected on
  any of the three questions, and Attachments back to the plain empty dropzone (just "Choose a file
  or drag it here.", no thumbnails) rather than the frame's filled example.
- **Attachments**: the frame's filled-in example (2 photos + a PDF + 3 more photos, each with its
  own remove badge, plus prev/next nav) was downloaded as real exported assets
  (`assets/images/service-issues/attach-1.png`…`attach-6.png`, `assets/icons/service-issues/
  file-paper.svg`, `chevron-left/right-20.svg`, `remove-x-circle.svg`) rather than re-drawn — the
  markup and CSS for that filled state are still in the codebase (`.rmr-svc-attach__zone--filled`)
  even though the form no longer renders it by default, since it's real, correctly-sourced anatomy
  worth keeping rather than deleting.

  **Fix: the remove badge on each attachment thumbnail wasn't visible.** Its real anatomy (node
  `3007:15696` etc.) is two separate layers — a flat blue circle (`Ellipse 130`, `#1a64bc` /
  `--color-blue-600`) with a plain white ✕ centered on top — but an earlier pass gave the button a
  *white* circular background behind that same white ✕, rendering as a near-invisible white-on-white
  badge. `.rmr-svc-attach__thumb-remove`'s background is now `--color-blue-600` (a plain CSS fill
  reproduces the flat circle exactly, so no separate circle image is needed) with the same real ✕
  glyph on top.
- **Correction: no fixed height, no internal scroll, no footer divider.** An earlier pass gave this
  step a fixed 604px height with the header/footer pinned and only `.rmr-modal__body` scrolling
  internally (reusing the Make a Payment flow's fixed-chrome/scrolling-middle technique via a
  `.rmr-modal--pinned` modifier), plus a `border-top` on the footer to give the scroll boundary a
  clean edge. Per explicit instruction, the modal is back to a plain auto-height `.rmr-modal` (base
  `max-height: 90vh` still applies as a safety net, not as the primary mechanism) — the real content
  fits comfortably within a normal viewport without scrolling, so the fixed height and its
  accompanying scrollbar/divider were solving a problem that didn't need solving. `.rmr-modal--pinned`
  itself is left in the codebase as a general-purpose modifier (still real, still correct) in case a
  future modal's content genuinely needs it.
- The Description textarea's native resize handle is disabled (`resize: none` on `.rmr-modal__textarea`,
  which also covers Email Property Manager's Description field, the only other user of that class) —
  a code-level interaction choice, not a Figma-sourced detail.
- **Step 2 (Schedule)**: a 3-day slot grid (Wed 04–Fri 06 Feb 2026, the exact slots shown in the
  frame) plus a "Selected Time Slots" panel. Clicking a slot toggles it (max 3); selection order
  drives the Preferred / Alternate 1 / Alternate 2 labels on both the slot and the selected-slot
  card, matching the MS 1 (nothing selected) → MS 2 (3 selected) states in the two source frames.
  The frame's "Drag to rearrange preferences" reordering isn't implemented — slots can be removed
  and re-added, but not dragged — everything else about the step is real. The day-navigation
  chevrons are `fake-submit` (no data exists for days outside Feb 4–6).

  **Correction: the selected-state styling was wrong and re-verified against the real nodes**
  (`2438:33028` for the "Selected Time Slots" panel, `2886:20902` for the slot buttons themselves).
  Fixed: the panel uses `--background-secondary` (a light gray, not white/transparent) plus
  `--dropshadow-sm` and 20px (`spacing/lg`) padding, not 24px; both the slot buttons and the
  selected-slot cards use `--component-selector` as their selected background (a light blue tint,
  not the plain default white) with a **2px** border for Preferred vs **1px** for Alternate 1/2 (not
  a uniform border weight) in `--border-button-tertiary`; day/time text is centered, not
  left-aligned, with the day in bold 12px and the time in regular 16px (the opposite hierarchy of
  what was there before); the Preferred badge is solid `--color-blue-500` with white text, Alternate
  badges are `--color-blue-200` with dark text (regular weight, not bold); the remove ✕ is a plain
  dark glyph (no circle background) positioned vertically centered on the card's right edge, not in
  the top-right corner; and the Preferred card sits inside its own wrapper with a border-bottom
  divider separating it from the Alternate cards below, which the plain 3-card list didn't have.
- **Step 3 (Confirmation)**: reuses `.rmr-pmt-success*` (the Make a Payment success screen's
  icon/title/body/details-box classes) with a new 3-column row for Preferred/Alternate 1/Alternate
  2 — the summary reflects whatever was actually selected in step 2, not a hardcoded example.

## Issue Details overlay (`maintenance.html`)

Clicking any row in either register (Open or Closed) opens an Issue Details overlay, sourced from
the same file's "Issue Details" section (node `2792:94770`) — seven frames covering every combination
of open/closed and two-way / one-way / disabled / closed-thread communication, plus a legacy
Notes-style variant:

| Frame | Node ID | Used for |
|---|---|---|
| 3.4.1 Issue Details - one way communication | `2524:18032` | Open issue, staff-only thread (no reply box), Pending schedule |
| 3.5.1 Issue Details - Two-way Communication | `2421:18785` | Open issue, tenant can reply |
| 3.5.2 Issue Details - w/ MS confirmed | `2421:19195` | Open issue, Confirmed schedule + assigned tech, 4-message thread |
| 3.5.3 Closed Issue Details - MS disabled | `2794:94773` | Closed issue, "Issue is closed." footer |
| Communication Disabled (nested under 3.5.3) | `3197:15040` | Closed issue, "Communication is disabled." footer |
| 3.4.2 Issue Details - Legacy History/Notes | `2572:7198` | "Notes" panel variant — a read-only vertical timeline instead of a chat thread, used on `open-130` and `closed-175` |

Built as **one flexible modal** (`data-modal-backdrop="svc-details"` in `maintenance.html`),
populated per-issue by a `SVC_ISSUES` map in `app.js`, rather than six separate static markups —
every frame shares the same left-column anatomy (status dot, title, created date, an optional
schedule-status card, description, pets/entry answers, an optional Resolution, optional
Attachments) and differs only in which state the right-hand Messages panel is in (all chat-mode
examples are labeled "Messages," not "Comments" — the Notes/Timeline variant is labeled "Notes"). Per
instruction, a row with no comments at all hides that whole panel rather than showing an empty box
(see `open-97` below) — the modal falls back to a single-column layout in that case.

**Correction: Category and "Has this happened before?" are shown too**, in the same field order as
the Add Service Issue form (Issue → Category → Description → "Has this happened before?" → …) —
these two fields exist on the Add form but not in any of the six real Issue Details frames above,
which never show them; added per explicit instruction that every field captured on Add should be
reflected back in Details, for both open and closed issues. Real values only exist for `open-175`
("Other" / "Yes" — this is the one example row whose content matches the Add form's own example
1:1), so that's the only row where they're populated; everywhere else they're hidden rather than
invented, the same "don't fabricate when no source exists" rule already applied to Description
elsewhere in this section.

Every row number, sender name, timestamp, and message body shown is transcribed verbatim from the
six frames — including one visible source oddity (a `02/17/36` timestamp on the "You" message,
almost certainly a `2026` typo in the original file) kept as-is rather than silently corrected, and
"Alternate 2" duplicating "Preferred"'s exact day/time in the one-way frame's Pending schedule card,
also kept as-is.

**Rows don't map 1:1 to the six frames' own example numbers** (all six show "Issue #179," a single
illustrative example): five of the six frames' worth of state were distributed across the register's
own real rows instead, so a user actually clicking through the prototype sees content that's
internally consistent (the row they clicked matches what opens) while every individual piece of
content — messages, answers, attachments — still comes straight from the source frames:

| Row (register key) | Comments state | Schedule | Attachments | Notes |
|---|---|---|---|---|
| Open #175 "Thermostat not working" | Two-way, 4 messages (richest example — merges 3.5.1's photo attachment on a message with 3.5.2's 4-message thread) | Confirmed, tech assigned | Yes | Register's own row title changed from "Closet door broken" to "Thermostat not working" so it matches this frame's real Description text instead of showing a mismatched title over real thermostat copy |
| Open #130 "Leaky faucet in kitchen" | **Notes** (timeline, from `2572:7198`), 2 entries | Pending, 3 alternates (this frame's own real schedule) | Yes | Description hidden — no real copy exists for this title |
| Open #97 "Water stain on ceiling" | Hidden entirely (no Comments panel) | None | None | The "no comments at all" example |
| Closed #175 "Closet door broken" | **Notes** (timeline, from `2572:7198`), same 2 entries reused on a closed row | — | Yes | Resolution: "Replaced with new door" (from the register) |
| Closed #130 "Kitchen sink leaking" | "Issue is closed." | — | No | Resolution: "Installed new valve" (from the register) |
| All other Closed rows | Hidden (no per-row example authored) | None | None | Falls back to a generic summary built from that row's own real Issue/Resolution/Closed-date cells — not invented, just not given a unique comment thread |

The comment input's paperclip/send icons are the real exported assets (`attach-file.svg`,
`send.svg`, downloaded from node `2500:10133`) — a self message's "more options" affordance uses
`kebab-vert.svg` from the same node. Note the send icon renders gray (`--icon-disabled`-equivalent,
`#C2C8CC`) by default rather than blue, matching the real frame exactly — a real detail, not a
placeholder. Sending a comment uses the same `fake-submit` toast pattern as everywhere else in this
prototype (and, consistent with that pattern elsewhere, also closes the modal — not a special case
written for this flow).

**Correction: full re-verification against node `2500:10133`** (the actual modal frame nested under
3.5.2, `2421:19195`) — an initial pass had approximated several details from a screenshot rather than
inspecting the real node, and all of the following were wrong: the modal was a fixed 900px instead of
the real 1128px (618px content column + 438px Messages column, `flex: 618 1 280px` / `flex: 438 1
240px` so the two columns keep their real proportion as the modal shrinks — capped at
`max-width: min(1128px, 94vw)` so it also stays "as wide as possible" without overflowing a smaller
viewport); several type sizes and colors were guessed rather than read off the node (field labels use
`--secondary-text` `#747474`, not `--text-secondary`; the title is `--font-size-lg`/`--line-height-xl`,
18px/28px); the Messages panel's background, shadow, and bubble treatment didn't match (real panel
background is `--background-secondary` with a three-layer drop shadow, other-party bubbles use a new
`--component-footer` token `#f1f3f5`, self bubbles use `--color-blue-200`, both at `16px` border-radius
— not `--spacing-lg`'s existing 20px fallback, a naming collision caught while rewriting this); each
message's sender name and timestamp are two separately-colored spans (`--text-secondary` /
`--text-accent`), not one run of text; and the Attachments row had no carousel affordance at all —
added a header (label + prev/next nav, matching the Add form's own `fake-submit` nav convention) and a
right-edge fade-out gradient over the thumbnail track, both present in the real frame.

**Correction: two more bugs found comparing the rebuilt panel against the real node** — the title
(`<h3>`) was picking up the browser's default bold weight since no `font-weight` was set, when the
real style is regular; fixed by setting `font-weight: var(--font-weight-regular)` explicitly. And the
self-sent bubble's `max-width: 85%` was a percentage of its own shrink-to-fit flex container, which
self-referentially clipped a few pixels off short one-line messages and forced them to wrap early
(the real node has no such constraint — bubbles are `whitespace-nowrap` up to a generous `1000px`
ceiling that never actually engages at these widths); replaced with a fixed `max-width: 320px` so
short messages stay on one line while long ones still wrap before overflowing the panel.

**Attachments carousel now actually scrolls.** The prev/next nav was originally two `fake-submit`
stubs (per the "not included in this example" pattern used elsewhere for genuinely out-of-scope
interactions); this was upgraded to a real horizontal scroller since the arrows exist specifically to
reveal more content, not to demonstrate a toast. `svcSetupAttachCarousel()` in `app.js` scrolls the
track by ~2 thumbnails per click and toggles each arrow (and the right-edge fade) based on scroll
position — both arrows hide entirely when every attachment already fits without scrolling, the left
arrow hides at the start, and the right arrow (with the fade) hides at the end. The setup call has to
run after `backdrop.hidden = false`, not before — measuring `scrollWidth`/`clientWidth` while the
modal is still `display:none` reads as zero and made the carousel think nothing overflowed.

**Notes/Timeline variant built** (node `2572:7198`, "3.4.2 Issue Details - Legacy History/Notes"),
previously left out as out of scope. It's a genuinely different right-panel format from the chat
frames — a read-only vertical timeline (a small stroked dot per entry, connected by a thin `#d3d3d3`
line between consecutive dots only, never before the first or after the last) instead of message
bubbles, with no input row regardless of open/closed status. Two real per-entry patterns from the
source: a plain note ("Need to order part") and a note with an attached-image link (an image glyph +
blue filename, "IMG_6700.jpg") — both transcribed verbatim, including the frame's own four-digit-year
timestamp format (`02/17/2026`), which is different from the two-digit-year format used everywhere
else in this section and kept as a real, deliberate difference rather than normalized away. The
frame's Description/answer text also uses a distinct, darker `--legacy-primary-text` (`#0a0a0a`)
rather than this file's usual `--text-primary` (`#313233`) — a genuinely separate token confirmed via
`get_variable_defs` ("Primary Text" vs. "Text/Primary"), not a mismatch to fix. Reuses the existing
`.rmr-svc-comments`/`__title`/`__panel` classes for the shared label+card chrome; only the thread
content is new (`.rmr-svc-notes__*`). Applied to `open-130` (whose Pending/3-alternate schedule
already matched this exact frame) and, per instruction to make more than one example, reused again on
`closed-175` to show the same variant on a closed issue — there's only one real source frame for this
format, so both examples transcribe the same two entries rather than inventing a second set.

**Attachments added inline in a Note also appear in the main Attachments carousel, as image
previews** — per explicit instruction. `svcOpenIssueDetails()` merges any `comments.entries[].
attachment.src` into the row's `attachments` list before rendering the carousel, so "IMG_6700.jpg"
shows up as an actual thumbnail alongside the issue's own attachments, not just as the blue text link
inside the note. The source frame only gives a filename for this attachment (no real bitmap), so the
preview reuses `attach-6.png` — one of the six generic stand-in photos already downloaded for this
section's other examples, and not otherwise used on this row, rather than fabricating a new asset.

**Category dropdown has no real options in the source** — the field exists in the design but no
option list was ever specified. Built as a non-functional `fake-submit`-styled field (matching the
"Category" trigger's visual box) rather than inventing category names.

**Register fits the viewport; only the table scrolls**: the register card no longer grows with row
count — it fits within the space below the header/hero/banner, and only the table under the
Open/Closed Issues tabs scrolls internally (reusing `.rmr-pay-table-wrap`, the same treatment as the
Payments & Charges register, sticky header included), while the Date Range field, Add Service Issue
button, tabs, and "Showing X of Y" footer stay fixed in place. This uses two new modifier classes,
`.rmr-settings-page--fit` / `.rmr-settings-card--fit`, added only on `maintenance.html` — every other
page built on the shared `.rmr-settings-page`/`.rmr-settings-card` classes (Account Settings, Payment
Methods, Add Issue) keeps its original auto-height, whole-page-scrolls behavior unchanged.

## Scroll bar (shared across the project)

Every scrollable region (the sidebar, the main content pane, modals, the Payments register,
Dashboard's Tasks/Latest Updates lists, dropdown option lists, etc.) now uses one shared treatment
in `assets/rmr.css`, defined once near the top of the file rather than per-page:

- The real Figma "scroll bar" component (design system file `W4wEUn8A4hkTdiAgEV8wSK`, node
  `134:2342`) replaces every browser's own OS-drawn bar: an 8px rounded thumb, no border, via
  `::-webkit-scrollbar` (Chromium) and `scrollbar-width: thin` / `scrollbar-color` (Firefox). The
  track itself is transparent — no fill, no shape — so only the thumb is ever visible; the bar never
  reads as its own little boxed container sitting next to the content.
- `scrollbar-gutter: stable` reserves that 8px permanently — whether or not a region is currently
  tall enough to actually need to scroll — so a region's visible content never shifts width the
  moment scrolling starts or stops, and the region's own outer box (e.g. a register card's fixed
  width) never resizes either way.
- Regions whose content would otherwise sit flush against the edge (`.rmr-tasks`, `.rmr-notif-list`,
  `.rmr-pay-table-wrap`) also get their own `padding-right` (and `padding-bottom` for the
  horizontally-scrolling `.rmr-pmt-table-wrap` / `.rmr-pay-table-wrap`), so the bar always lands in
  a dedicated 8px gap next to the content, never drawn over or inside it. Regions that already carry
  ≥8px of their own edge padding (`.rmr-modal`, `.rmr-pmt-body`, `.rmr-dropdown__menu`) skip the
  extra padding since that padding already is the gap.
- `scrollbar-gutter` only affects the vertical (block-axis) scrollbar per spec, so it's left off
  `.rmr-pmt-table-wrap`, which only ever scrolls horizontally (see its own comment in `rmr.css`).

**Fix: fixed-height modals were reserving a gutter for a scrollbar that never appears there.**
`.rmr-modal--payment`, `.rmr-modal--autopay`, and `.rmr-modal--pinned` (Add Service Issue) all scroll
via an *inner* region (`.rmr-pmt-body`, or `.rmr-modal__body` for the pinned variant) — the outer
`.rmr-modal` box itself never scrolls for these. Since `.rmr-modal` was in the shared `scrollbar-gutter:
stable` group above, these three were still reserving that 8-ish px gutter on the outer box for a
scrollbar that can never appear there, on top of the modal's own 24px padding — pushing the header's
close button (and everything else) ~36px from the edge instead of the real 24px. First fix reset
`overflow-y: hidden; scrollbar-gutter: auto;` on those three specifically.

**Follow-up: it was still happening on every other modal too** (Lease Track, Flex, Contact Us, Cash
Pay, Email Property Manager, every Account Settings modal, etc.) — the bare `.rmr-modal` class itself
was still in the shared `scrollbar-gutter: stable` group, and in practice none of these modals are
tall enough to ever actually need the outer box to scroll (they're all short, fixed content); the
reservation was just permanent dead space on all of them. Removed the bare `.rmr-modal` from that
shared group entirely — `overflow-y: auto` (already set on the base `.rmr-modal` rule) still lets one
scroll for real if its content ever does run long, and still gets the shared thin/transparent
scrollbar look when it does; it just no longer pre-reserves space for that case. Checked every modal
in the project after this change (Dashboard's 5 overlays + Make a Payment + AutoPay, Account
Settings' 6 modals, Payments' Make a Payment/AutoPay, and Service Issues' 4) — every one now measures
the real 24px from content to the header's close button.

## Faked for the demo (see `assets/proto.css` / `assets/app.js`)

- No backend: every overlay button ("Upload Existing", "View Coverage Options", "View FAQ", "Apply
  Now", "Find a Cash Pay location", "Send Email"), plus "Start", "Sign", "View Account", "Logout",
  "View Platform Fees", "Zego Privacy Policy", "Print Receipt", "Delete", "Clear All Fields", "Use
  Address on File", and "Edit AutoPay" on the AutoPay Success screen, show a toast instead of
  performing a real action. The Payment Methods page's "Save" does too, once Terms is checked and
  it un-disables — no data actually changes.
- The Email Property Manager overlay's inputs, and the Make a Payment / AutoPay setup / Payment
  Methods edit forms, are real, editable fields — nothing is submitted anywhere, and no math
  (totals, overpayment amounts) is live-recalculated from them.
- Sidebar "Collapse" toggles a CSS class only — no persistence.
- The User Info button opens a real account popover (from the "2.0.2 Tasks on Linked Account"
  frame, node `2511:3289`) — but it's display-only, matching the Scope section above.
- **Now real, not faked**: "Make a Payment" and the Balance Due gear icon (routes to
  `payment-settings.html`), the account dropdown's "Payment Settings" item, the AutoPay banner's
  "Set Up" button, and the Payment Settings page's "Payment Methods"/"AutoPay" rows (routing to
  `payment-methods.html` and the AutoPay flow respectively) all open their real flow/page rather
  than a toast — see the sections above.

## Document Center

Sourced live via `get_design_context` from
`https://www.figma.com/design/Sip0wuWPnMa5duL1L39HDn/RMR-Rewrite---Lease---Documents-Pages-Combined?node-id=2786-46043`
(frame "3.1.3 Document Center - Tenant View (DTS)", node `2786:46043`) — a different Figma file
than the rest of this prototype. The frame was too large for a single `get_design_context` call and
came back as sparse metadata with no child node IDs; `get_metadata` on the same node didn't expand
children either (this MCP connector appears to key off the Figma desktop app's live selection rather
than returning a full tree for an arbitrarily large frame), so the full node tree was pulled with
`forceCode: true` instead, then read from its saved output file with `jq`/`grep` rather than by
paging through it in-context.

Two registers, both built (nothing skipped in this frame):

- **Documents to Sign** (`.rmr-doc-card--sign`, node `3026:64265` — internally named "DTS" in
  Figma's own layer tree, reusing a "Charges"-named table component from Payments rather than a
  purpose-built one; the visible content is genuinely documents, not a copy/paste leftover). Figma
  lays this out as one per-column flex "Table" per field (Document Name/Published/Expiration/Number
  of Signers/Sign button/Print+Download icons); translated into one real `<table>`, same as the
  Payments register's own translation of a similar per-column Figma layout. 8 rows, matching the
  frame exactly (Noise Complaint — the only row with the italic 2-line subtitle "A formal notice
  regarding noise violations..." — NSF Notice, Parking Policy, Utility Service Agreement, Window
  Treatment Authorization, Water Shutoff Notice, Parking Violation, Pet Policy Update), footer "12
  Total Documents" (the frame's own footer count; only 8 rows are actually shown, same kind of
  register/footer-count mismatch already noted and kept as-is elsewhere in this prototype rather
  than "corrected"). "Sign" is real primary-button styling at the frame's own compact 24px height
  (new `.rmr-btn--table` modifier); Print and Download are a leading+trailing icon pair inside one
  64px column, matching the frame's own single combined cell for both.
- **Leases & Documents** (`.rmr-doc-card--leases`, node `3025:59022`): a Search field + a Property
  filter (single "All Selected" option, same one-option-dropdown precedent as every other dropdown
  in this prototype) + a "Show Past Leases" checkbox, above a 3-level property → lease-period →
  document tree, also flattened into one real `<table>` rather than Figma's per-column layout.
  2 properties (Riverview Apartments - Unit #4, Safe & Secure Storage - Unit SS1), matching the
  frame's own "Showing 2 of 2 Leases" footer.

**Correction: the two cards now split available width 50/50, not the frame's own fixed 828px/740px.**
The source frame gives Documents to Sign a fixed 828px and lets Leases & Documents (`flex: 1`) absorb
whatever's left — real, sourced values, but per direct instruction this is a deliberate departure
from them: both cards are now `flex: 1 1 0` with a shared `min-width: 480px`, so they always share
the row evenly on wide screens and still wrap to a stacked column at the same width either one would.
The Documents to Sign table's fixed per-column widths (764px total) can now exceed its half of a
narrower `.rmr-doc-columns`, which is fine — `.rmr-pay-table-wrap` already scrolls horizontally for
exactly this case, the same as the Payments/All Activity registers.

**Tree expand/collapse — only wired up where the frame actually shows both states, at first.** The
lease-period rows were originally the only level where the frame depicted both a collapsed state
("June 2026 – June 2027 Lease (Upcoming)", plain right-pointing chevron, no visible documents under
it) and an expanded one ("June 2025 – June 2026 Lease", `rotate-90` chevron, Lease Agreement + Pet
Policy rows visible beneath it) — so only that level first got real click-to-toggle behavior in
`app.js` (`data-action="doc-tree-toggle"`, scoped by `data-doc-tree-id`/`data-doc-tree-parent`,
rotating `.rmr-doc-tree__chevron` via `[data-doc-tree-expanded="true"]`), while the property level's
own leftmost chevron stayed static/always-expanded, since the frame itself never shows a property
row collapsed. **Since corrected, per direct instruction, to a real working toggle at the property
level too** — see "Correction: the property-level chevron..." further below for the generalized
recursive collapse/expand this needed in `app.js`. The collapsed "Upcoming" lease row's toggle is
still live (it rotates on click) but reveals nothing on its own — see "Document not ready" in the
Lease Renewal flow section, which gave that empty toggle a real destination instead.

**Scope/deviation notes**:
- The frame's own left nav shows the full 11-item Tenant menu (Architectural Requests, Meter
  Readings, Community, Reservations, Notes, Polls, Violations, etc.) — trimmed to this prototype's
  standing 4-item sidebar (Dashboard/Charges & Payments/Service Issues/Document Center) per the
  Scope section at the top of this file, same as every other screen.
- The frame's header includes a bell/notifications icon (`BellNotif` component, next to the globe)
  that no other screen's header in this prototype has (checked `dashboard.html` and `payments.html`
  directly — both are globe-only). Rather than a one-off header that's inconsistent with every other
  page, the existing globe-only header was kept as-is here too, for shared-chrome parity across the
  app. Flagging this as a real gap rather than silently normalizing it: if the header is meant to
  gain a bell app-wide, that should be a deliberate pass across every screen, not something Document
  Center introduces unilaterally.
- The full-bleed blueprint-pattern background image behind the whole frame, and the decorative
  "rmRP bg" line-art watermark layer, were both skipped as minor visual flourishes — same precedent
  as the Payment Settings page skipping its own version of the same watermark. The plain
  `--background-page` (`#f6fafe`) backdrop already used app-wide covers the same visual role.
- Assets: `assets/icons/documents/` (search, folder, print, file-download, keyboard-arrow-right —
  all downloaded fresh from this frame's own exported nodes) and `assets/images/documents/hero.png`
  (the Context Bar's property-photo background, reusing the existing `.rmr-settings-hero` component
  built for Service Issues/Payment Settings — same real "compact photo hero" pattern, different
  photo). The check icon reuses the existing `assets/icons/check.svg` (already used for AutoPay's
  password-requirements checklist) rather than downloading a duplicate, since it's the same
  Material "check" glyph at the same 20px size.

## Architectural Requests page

Sourced from file `AsaQeq0Rbv6ubeIhdpYDiW` ("RMR UI Rewrite — Architectural Requests"), "Section 4"
(node `2218:4516`), which has 7 frames: the register with its two tabs (`2020:1078` "2.2 My
Requests" / `2025:2184` "3.2 Requests to Review"), two Request Details overlays (`2020:1267` "2.3
Architectural Request" / `2026:7517` "3.3 Request to Review - Details," both nested under their own
page frame's Ghosting layer), two Add Request overlay variants (`2020:1171` "2.4 Submit Request -
Simple Form" / `2026:7271` "2.5 Submit Request - Custom Form"), and a confirmation toast (`2040:4107`
"2.6 Submit Request - Submitted"). Third page on the Full Product track — see "Full Product — scope"
above for the nav-ordering call.

**Register** (`architectural-requests.html`): reuses `.rmr-pay-hero`-family styling via
`.rmr-settings-hero` + a reused `.rmr-pay-hero__address` span (this page's own Header Image needed
both a title *and* an address, which only Payments & Charges' hero pattern has — `.rmr-settings-hero`
alone doesn't), `.rmr-comm-layout`/`.rmr-comm-card`/`.rmr-comm-main`/`.rmr-comm-sidebar` (the same
1140px-content + 428px-sidebar two-column shape Community/Reservations already use, for the register
card + "Request Guidelines" card), `.rmr-acct-tabs` (My Requests/Requests to Review), `.rmr-pay-table`
(both tabs' columns), and `.rmr-rsv-lozenge` for the Status column fills (green/yellow/red already
existed; blue — In Board Review — is this page's own real 4th color, `--color-blue-200`, added as
`.rmr-rsv-lozenge--blue`). The wrapping `.rmr-settings-page`/`.rmr-settings-page--fit` +
`.rmr-settings-card--fit`-equivalent (`min-height:0` on the `.rmr-comm-card.rmr-comm-main`) keeps the
register fit to the viewport with only its own table scrolling — same "only inner containers scroll"
standing rule as Service Issues/Reservations, not the whole-page-scrolls behavior Payments/Dashboard
use.

**Requests to Review tab's own 17-row table has only 10 real rows** — the frame's own footer text
reads "Showing 17 of 17 Requests," matching the same "footer count doesn't match real row count"
source-file pattern already documented for Service Issues' Closed register and Payments' Late Fee
column; the 10 real rows are rendered as-is rather than inventing 7 more. Two more genuine source
quirks on that same table's last row (Liam Anderson, "Install a Trellis," 10/21/25) were kept
verbatim rather than corrected: its **Address** cell literally repeats "Liam Anderson" (not a street
address), and its **Vote** cell literally repeats "Install a Trellis" (not a vote status) — both
re-verified directly against the node, not extraction errors.

**Correction: the "Paint the door" row's own real Details content says "Pending," not "Confirmed."**
Both Request Details overlays' one real sourced example (`2020:1267`/`2026:7517`) is keyed to "Paint
the door," Submitted 10/13/25, Samantha Carpenter — and that overlay's own Status Lozenge says
**Pending**. The *register's* own "Paint the door" table cell, however, is sourced as **Confirmed**
(green) — a genuine cross-frame mismatch in the source file, the same kind already resolved once in
this prototype for Service Issues (see "Register's own row title changed... so it matches this
frame's real Description text" under Service Issues above). Applying that same precedent again here:
the register row now shows **Pending** (matching the richer, real Details content a user actually
opens), rather than preserving a status a user would immediately see contradicted by the very modal
that row opens. The two other My Requests rows (Add Fence/Pending, Add Patio/In Board Review) and the
9 other Requests to Review rows have no real Details content of their own, so they stay exactly as
the register itself sources them and are `fake-submit` rather than opening a fabricated modal — same
"only the sourced example is wired" precedent as Amenity Reservations' calendar pills.

**Request Details overlay (My Requests tab, `arq-details-paint`) reuses Service Issues' own
`.rmr-svc-details-modal`/`.rmr-svc-details`/`.rmr-svc-comments*` wholesale** — per direct instruction
that these overlays should look like Service Issues' — confirmed to genuinely be the same two-way
"Messages" anatomy (status-dot header, Submitted/Submitted By, Description, Attachments, a Yes/No
field, a Messages panel with self/other bubbles and a comment input row) rather than just a
superficial resemblance. The one real message thread ("Just checking on the status of this." /
"Hi, I'll update you soon.") — including its own `02/17/36` timestamp typo — is transcribed verbatim,
same "don't silently fix apparent source mistakes" precedent as Service Issues' own identical typo.
The two attachment photos (`assets/images/architectural-requests/attach-1.png`/`attach-2.png`) are
this section's own real image fills, exported directly (and resized down from their multi-megabyte
originals to match this project's existing thumbnail-sized convention, same as every other attachment
image in the app).

**Request to Review Details overlay (`arq-vote-paint`) reuses the same left column, but its right
panel is the real Vote Details panel instead of Messages** — a genuinely different, real right-panel
format (node `2026:8065`), not a reskin: `.rmr-svc-comments__panel`'s own bordered/tinted card is
reused wholesale for the outer container (confirmed to be the identical real "card" anatomy as the
Messages panel — background-secondary, 1px border, the same 3-layer drop shadow), with only the
header row (title + Approve/Deny, `.rmr-arq-vote__header`, new) and the Name/Vote/Notes table inside
being new — that table is a plain `.rmr-pay-table`, the same real "cell" component the main register
uses. Approve and Deny are both the real Primary button style (Figma gives them equal styling, no
stated visual distinction between approve/deny), wired `fake-submit` since voting isn't part of this
build's scope.

**Add Request overlay reuses the "Custom Form" variant (`2026:7271`) only** — a strict superset of
"Simple Form" (`2020:1171`, same Request*/Description*/Attachments fields, nothing Custom omits), so
building the one richer variant covers everything either sourced frame shows rather than needing two
near-duplicate modals. `.rmr-modal--arq` (622px) matches this instance's own real width. Reuses
`.rmr-msg-banner`/`.rmr-modal__field`/`.rmr-modal__textarea`/`.rmr-acct-section-title` (the
"Architectural Request Information"/"Details" section headers — real Body/Large/Bold styling, 16px)
and, wholesale, Amenity Reservations' own Attachments dropzone (`.rmr-svc-attach__zone` +
`file-download-32.svg`) and `.rmr-rsv-date-btn` (First Request Date). "Has this been requested
before?" and "What's the priority?" have no real option lists in the source (same situation as
Service Issues' own Category field), so both stay `.rmr-modal__select`-styled `fake-submit` triggers
rather than inventing option values. Submit switches to the Submitted confirmation via the same
`switch-modal` mechanism as every other single-step-to-success flow in this app (no new JS needed).

**Confirmation toast** (`arq-submitted`) reuses `.rmr-pmt-success`/`.rmr-modal--narrow` verbatim (the
same "any future confirmation popup reuses this" standing rule as every other success screen in this
prototype). Its body copy — "Your **reservation** has been submitted, and will be reviewed soon." —
says "reservation," not "request," in the real Figma frame; kept verbatim as a genuine copy-paste
artifact from the Reservations flow, same "don't silently fix source copy" precedent as the message
thread's timestamp typo above.

**New assets.** `assets/icons/architectural-requests/info-outline-24.svg` (the Requests to Review
tab's own bordered info banner, `.rmr-arq-info-banner` — new, since the existing
`assets/icons/payments/mp-info-outline.svg` is natively 20px and this instance's own node is 24px;
per the project's standing "never render an icon below its own native size" rule, a new 24px export
was pulled rather than upscaling the 20px one). `assets/icons/nav-architecture.svg` (already present
in the repo from an earlier icon batch-export, unused until now) turned out to be an exact match for
this page's own sidebar glyph — confirmed by diffing its path data against the freshly-fetched Figma
asset byte-for-byte, so no new download was needed; inlined with `fill="currentColor"` per this app's
standing sidebar-icon pattern. `assets/icons/service-issues/file-paper.svg`,
`assets/icons/reservations/file-download-32.svg`, and `assets/icons/payments/campaign.svg` /
`calendar.svg` are all reused as exact matches (confirmed by diffing path data against this file's
own exported assets), not just close approximations.

**One overlay from the source file was not built.** The overview screenshot of Section 4 shows an
8th small popup ("Additional Notes" — a textarea + Submit, floating near the Add Request frames,
presumably a follow-up note prompt for a Deny vote) that isn't part of any of the 7 named top-level
frames' own metadata tree and couldn't be conclusively traced to a specific node within this
session's research budget. Per the "nothing invented" rule, it was left out rather than guessed at —
if this flow is wanted, it needs its own direct Figma link/node ID.

**Not built (same as every other page's stated scope note): a property-manager-side "Requests to
Review" administrative view.** The section's own frames are all genuinely tenant-facing (same full
Tenant-menu chrome as every other frame in this file, same Samantha Carpenter persona) — "Requests to
Review" is the tenant's own HOA-style neighbor-request voting queue, not a PM admin screen, so it
belongs on this same tenant-facing page rather than being out of scope.

## Polls page

**Register** (`polls.html`): reuses `.rmr-comm-layout`/`.rmr-comm-card`/`.rmr-comm-main` (single
column — this page's own source frame has no sidebar card, unlike Architectural Requests' "Request
Guidelines") and `.rmr-pay-table` (Name/Publish Date/End Date/Submitted columns) wholesale — no new
register-level classes needed. Only the one poll without a real Submitted date (Board Meeting) gets a
"Start" button; the other two (Community Feedback, General Amenities) are already-submitted rows with
no action cell, matching the source frame exactly. The footer's "3 Polls" count matches the real row
count (no source mismatch to resolve here, unlike Service Issues'/Architectural Requests' registers).
The Context Bar/hero photo intentionally does **not** use this page's own source-frame photo — per
standing instruction, it's sourced from the MVP hero photo instead (`assets/images/settings/
account-hero.png`, copied into this page's own `assets/images/polls/hero.png`), same as Community's
and Reservations' hero photos were retroactively swapped to match. This page's own Header Image node
also has no address line (unlike Community/Reservations/Architectural Requests, which all show "742
Willow Crescent, Apt 3B" under the title) — kept as sourced rather than adding one by analogy.

**Take a Poll wizard (Board Meeting).** The source file lays out 8 frames for this flow: an
Introduction page (node `2019:1877`), six "Poll Question" variant frames (Yes/No, Dropdown, Star
Rating, Numeric Rating, Text, Multiple Choice), and a Closing page. Each real question frame's own
footer carries a "n/5" progress label — Yes/No through Multiple Choice read 1/5 through 5/5 in order,
confirming a real 5-question sequence. Star Rating and Numeric Rating are **both labeled 3/5** and
laid out side-by-side on the canvas (Numeric Rating is off in its own column, `2148:3658`, not inline
with the other six sequential frames) — a documented alternative variant for that one slot, not a 6th
real question, so only Star Rating was built. Each step is its own `.rmr-modal--wide` (624px, this
instance's own real width) modal backdrop, chained via `switch-modal` (the same Back/Next
modal-to-modal mechanism as Reservations' New Reservation wizard) rather than a single modal with a
`data-step` counter, since no such counter pattern exists anywhere else in this prototype.

Every control reuses an existing real component: `.rmr-svc-choice` + `.rmr-pmt-radio` (Yes/No — the
plain circle-and-label anatomy, not the question label's own inline `.rmr-svc-question`/`.rmr-svc-
choices` layout, since this source frame stacks its two options vertically rather than inline),
`.rmr-dropdown` (the "biggest issues" question — a genuinely 4-option real dropdown, sourced from the
adjacent `Frame 1618873639` node showing its open state: Trash/Parking/Lawn/Noise Issues, unlike every
other dropdown in this prototype which has exactly one option), `.rmr-modal__field`/`__textarea`
(Anything else? — no separate field label above it, since the question text itself is the label here,
unlike Maintenance's Description field), and `.rmr-checkbox` (the food multi-select — Chipotle and
Panera keep the source frame's own pre-checked example state; "Choose up to 2" is not enforced with a
selection cap, same "skip validation that doesn't serve the demo" precedent as every other form in
this prototype). Finish's confirmation reuses `.rmr-pmt-success`/`.rmr-modal--narrow` verbatim ("Poll
Submitted" / "Your responses were submitted. Thank you!").

**New assets.** No star icon or rating pattern existed anywhere else in this prototype, so
`assets/icons/polls/star-filled.svg` and `star-outline.svg` were exported fresh from the Star Rating
frame's own nodes (`2019:2652`/`2019:2656`) — real 96×96 image fills, kept at that native size per the
project's standing "never render an icon below its own native size" rule rather than shrinking them to
a more typical rating-icon size. The sidebar's own "Polls" glyph reused `assets/icons/nav-poll.svg`
(already present in the repo, unused until now) — confirmed an exact path-data match for this frame's
own icon — inlined with `fill="currentColor"` per the standing sidebar-icon pattern rather than
referenced as an `<img>`.
