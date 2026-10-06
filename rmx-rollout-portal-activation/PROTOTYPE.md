# rmResident Portal Rollout

Rollout flow for **existing TWA users** in Rent Manager Express: dashboard announcement → Administration → conversion checklist → activation. Built from the Figma section *Existing TWA Users* (RMR Rewrite — Rollout Plan, node 2590:14159). Not connected to the RMR tenant prototype.

**Owner** Izabella Geza · **Started** 2026-10-02 · **Built with** rmx-prototyping 4.5.2

## Flow (updated)

Administration (Get started) → **Activate** → chooser: **Just Activate** → Activated; **Guided Setup** → Setup guide stepper (`screens/setup-guide.html`, 8 steps; step 8 offers Activate or Save & Don’t Activate). The conversion checklist below is **retired** (files kept, no longer reachable).

## Flow (previous)

Dashboard → Announcement Learn More → Administration (Get started) → Start Conversion → Administration (33%) → View My Checklist → Checklist (What's new → In progress → Multiple locations → Ready to activate) → Confirm Activation → Administration (Activated, toast).

Each state is its own file in `screens/`; `index.html` lists them in order.

Also: the Mega Menu's Administration tab opens `admin-menu.html` (full admin, Workspace tab opens the dashboard), and the tour icon beside “rmResident Portal” runs `tour-welcome` → `tour-why-use-it` → `tour-what-residents-can-do` → `tour-preview`.

## Not real yet

- Every item on the full admin page is inert except the left menu (jumps to sections; rmResident Portal opens screen 3). The Mega Menu's other tabs and items are the skill's placeholders.

- Everything not in the flow above is inert (`data-rmx-todo`): left admin menu, Command Launch, Reports, Favorites, Review links, Change Locations, dashboard links, Express Help, My Dashboard, etc.
- Checklist progress is real for the single-location path: Review on a profile opens its Profile Details; **Publish** marks it Ready (a non-default profile first shows “Ready to Publish”). Progress is by group (Portal Profiles, Payment Policies, Portal Login Settings). Payment Policies and Portal Login have no mocks yet: their circles just toggle Ready.
- State is kept in `sessionStorage`; opening `index.html` or the dashboard resets it.
- Page Settings and Account Management tabs on Profile Details, Add Profile, and the colour/theme/logo pickers (they select but don't change the preview) are not built.
- The Portal Preview is a screenshot of the Figma frame; Draft/Published toggle doesn't change it.
- Assumption: Publish on a profile means “mark Ready” (the real go-live happens at Activate). Confirm with the team.
- The 33% banner behind the checklist overlay is as drawn in Figma, even on the 100% state.
- `confirm-activation-single-location` is only reachable from the index; Figma doesn't say which account state selects it.
- Closing the checklist (X) goes to the 33% Administration page, or the 100% page once everything is Ready.

- The Administration page remembers conversion: after Start Conversion, opening Administration → rmResident Portal lands on the setup page (or Ready / Activated) instead of the Get Started banner. State resets when you open `index.html`, the dashboard, or `?start=1`.
- Portal Customization tour: from the info icon on the Portal Profiles register. Figma names the branding and page-settings steps inconsistently (step 3 titled Page Settings contains the branding text); built in the order of the dots.

## Administration pages

All five Administration screens (full menu, Get started, Conversion started, Ready to activate, Activated) are the same scrollable page: 14 sections plus rmResident Portal at the bottom, whose banner changes with the state. The left menu highlights the section at the top as you scroll and scrolls to a section on click. Opening Administration from the Mega Menu starts at the top (`admin-menu.html`, or `?top=1` when it redirects to the current state); every other arrival lands on rmResident Portal.

## Payment Policies (Figma "payment policy", RMR Rewrite — Payments & Charges, node 3326:27046)

`screens/payments-register.html`: register (Administration → Payment Policies) plus the Payment Policy Details overlay. On the checklist, Review on a policy opens the same overlay over the checklist (`assets/payments-overlay.js`); Publish (Save & Publish once edited) closes it and marks that policy Ready. Make Default / Make Inactive dialogs as drawn; Make Active has no mock and applies directly.
- Not real yet: Select Properties (inert, no mock); properties shown are mock data (the register mock shows “+1”, the checklist mock “+7”; each used as drawn).
- The Figma register is drawn in the classic Rent Manager look; it is built in the same RMX style as the Portal Profiles register.
- Charge-type options (RC, PET, PRK, LATE) and the preview’s column logic are assumed.

## Next

Portal Login gets the same Review → Publish → Ready flow once its Figma mock is provided.

## Profile statuses (from Figma "3.1.8 Profile Statuses")

Unsaved Changes (form dirty) → Save Draft → Unpublished Changes → Publish (before go-live) → Ready to Publish. Inactive profiles are read-only on Profile Details except the pencil (name, description, property types, Active). Add Profile opens the "Default Branding" frame with an inline editable header (Customization Name / Description / Select Property Types / Active); an existing profile shows the read-only header with the pencil. The post-go-live "Published" state is not reachable in this prototype.

## Open items from the Figma comparison

- App bar: Figma shows a blue filled bell with an orange badge and an outlined documents icon; the skill's header draws a white bell and a filled documents icon (non-composable library component). Raise with Emma.
- Naming: some frames say "Profile" (register, Profile Details) and the Default Branding frame says "Customization" (title, labels). Both are used as drawn; needs one term.
- Dashboard: the "Rent Manager University" logo image and the Email field's person icon are not harvested yet.
- Assign to Property Type: Figma lists `<All Property Types>` first; not built.
- Checklist groups: row height, group-icon tiles and location headers were aligned to Figma; confirm at 1920 against the frames.

## Deliberate deviations

| Rule | Where | Why we kept it |
|---|---|---|
| Profile Details tabs have an orange active underline | `profile-branding`, `profile-settings` | Figma draws them orange (`--border-attention`); the system's active tab underline is blue. Kept as drawn; raise with Emma. |
| Accent colour swatch uses an inline hex | Portal Branding, Accent Color | No token for `#5597e7` (Figma `component/button-accent`). |
| Icon tile colours are inline hex | Tour steps, What's new | Figma neutral/400 `#dbe1e5`, green/300 `#c9e5c3`, yellow/300 `#f9d57b`, blue/200 `#afcef4`; no tokens exist. Confirmed by design. |
| Progress Bar is blue and 8px | Checklist review items | The library Progress Bar is a 12px green fill; the checklist mock draws a thinner blue bar. Followed the mock (confirmed). |
| Portal Preview carries its own type, colours and a full-bleed background image | `assets/rollout/preview/` | It reproduces the tenant portal (a different product surface: Lato, 48px balance), so the RMX type-style audit flags it. |
| Profile Details tabs keep the orange underline | profile pages | Open question: system says blue; Figma draws orange. |
| Mega Menu tabs wired by a prototype script | `assets/rollout-nav.js` | The skill's menu marks Administration as unbuilt; the script routes it without editing the shared file. |
| Admin setup banner is not a library component | `.ro-banner` (3 states) | Figma draws it as a frame (orange / pale blue / pale green with a CTA); closest is Callout, which is 40px outlined. Raise with Emma if it should become a component. |
| Orange and green CTA buttons | Start Conversion, Activate | Drawn in Figma as solid `--icon-attention` / `--icon-success` buttons; no such Button variant exists. |
| Admin header bar | `Mega Menu Headers` styling | Admin frames use a white header (Admin Menu logo, title, “Find an item”) in place of the blue Context Bar. |
| “What's new” glyphs | Checklist overlay | Figma icons weren't in the core set; real core glyphs (list, calendar, visibility, settings) used instead. |
| Find an item field is 32px | Administration header | Drawn at 32px in Figma. |
| Hand-built pieces are not tagged as library components | Banner, Dialog Overlay, Pop Up, dashboard Tiles, Progress Circle/Bar, Accordion | The audit flags library-tagged elements carrying custom classes, so these are untagged until the library covers them. |
| “Rent Manager University” logo | My Training tile | Logo graphic not harvested; rendered as text. |
| “Customization Profiles” → “Portal Profiles” | Blooming Floral Co. rows | Figma label looks like a leftover; unified with Default. |
| Photos and Express icons are linked files | `assets/rollout/` | `bundle.mjs` does not inline images; publish the folder as-is (GitHub Pages). |
