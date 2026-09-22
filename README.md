# rmResident Portal — Tenant Prototype

Presentation-only click-through prototype for LCS's rmResident Portal (RMR), built from the real
RMR Figma design system. See [`rmr-tenant-portal/PROTOTYPE.md`](rmr-tenant-portal/PROTOTYPE.md) for
full sourcing notes, scope decisions, and what's built vs. pending.

## Running it locally

No build step or dependencies — it's static HTML/CSS/JS. Any static file server works, e.g.:

```bash
cd rmr-tenant-portal
python3 -m http.server 4173
```

Then open `http://localhost:4173/MVP.html` or `http://localhost:4173/Full-Product.html`.

If you're using Claude Code with this repo open, `.claude/launch.json` is already wired up to do
the same thing — just start the `rmr-preview` configuration.

## Structure

```
rmr-tenant-portal/
  MVP.html                single-page app — MVP's 4 tabs (Dashboard, Charges & Payments,
                           Service Issues, Document Center), starts on Dashboard
  Full-Product.html       single-page app — Full Product's full tab set (adds Community,
                           Reservations, Architectural Requests, Polls, Meter Readings, Notes,
                           Violations, Reports on top of the same 4), starts on Dashboard
  assets/
    rmr.css              real design tokens (colors, spacing, type)
    proto.css             prototype-only fakery (kept separate, commented)
    app.js                shared interaction wiring
    icons/, images/       assets exported from Figma
  PROTOTYPE.md            sourcing notes, scope decisions, deviations
```

Each file is a single HTML document: one shared header/sidebar shell, with every screen's markup
present up front and shown/hidden by `assets/app.js`'s panel-switcher as you click the nav —
no separate page loads.
