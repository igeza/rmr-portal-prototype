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

Then open `http://localhost:4173` (the launcher page links to every built screen).

If you're using Claude Code with this repo open, `.claude/launch.json` is already wired up to do
the same thing — just start the `rmr-preview` configuration.

## Structure

```
rmr-tenant-portal/
  index.html            launcher — links to every screen
  screens/               one HTML file per screen
  assets/
    rmr.css              real design tokens (colors, spacing, type)
    proto.css             prototype-only fakery (kept separate, commented)
    app.js                shared interaction wiring
    icons/, images/       assets exported from Figma
  PROTOTYPE.md            sourcing notes, scope decisions, deviations
```
