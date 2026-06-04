# Admin Panel — Implementation Plan

> **Decision (2026-06-04):** Variant **A** — local admin + `projects.json` + git. The public portfolio stays free static hosting (GitHub Pages, `docs/`). No hosted backend or BaaS.

Goal: a real admin UI in the `admin` app to manage portfolio projects — list, **drag-and-drop reordering**, create/edit/delete, and image upload — with data moved out of the compiled TS array into an editable `projects.json`.

---

## Context (starting point)
- Projects are currently a **static TS array** in [projects.data.ts](projects/shared-data/src/lib/data/projects.data.ts), compiled into the portfolio build.
- The `admin` app ([projects/admin/](projects/admin/)) is an **empty Angular scaffold** (no routes, UI or services).
- The portfolio deploys as **static** output to `docs/` (GitHub Pages). There is **no backend / database**.

## Key architectural decision — persistence
For the admin to actually change anything, the portfolio must read data **at runtime** (not compiled-in). Options considered:

| Variant | What | Pros | Cons | Est. |
|---|---|---|---|---|
| **A (chosen)** | Local admin writes `projects.json` (+ images), commit & redeploy | Free static site, data in git, zero external deps | Changes go live only after redeploy | ~5–6 d |
| B | Cloud BaaS (Supabase/Firebase) | Instant-live edits, deployable admin | Needs auth + external service | ~7–8 d |
| C | Own .NET API + DB + hosting | Full control, good .NET demo | Needs backend hosting + upkeep | ~8–10 d |

Plan below is for **Variant A**, with notes on what B/C would add.

---

## Phase 1 — Data refactor (immediate value, independent of the admin)
1. Add `order: number` to the model in [project.model.ts](projects/shared-data/src/lib/models/project.model.ts).
2. Move the `PROJECTS` array → `projects.json` (in `shared-data`, next to `profile.json`).
3. Expose `projects.json` to the portfolio as a static asset (copy into `public/`, as already done for the profile/CV).
4. Rewrite `ProjectsService` in the portfolio to read the JSON via `HttpClient` at runtime and **sort by `order`**.
5. Verify cards / tech filter / detail page / video still work.

→ After this, project order is controlled by the `order` number in JSON. **Est: 0.5–1 day.**

## Phase 2 — Local backend for saving
1. A small service (Express **or** .NET minimal API) for local use only.
2. Endpoints: `GET /api/projects`, `PUT /api/projects` (save full list incl. order), `POST /api/projects/:id/image` (file upload).
3. Writes `projects.json` and stores images in `public/projects/`.
4. npm script `start:admin:api` + proxy from the admin app.

**Est: 1 day.**

## Phase 3 — Admin: list + drag-and-drop ordering
1. Admin routing: `/projects` (list).
2. `AdminProjectsService` — talks to the backend.
3. Card list with **drag-and-drop** via `@angular/cdk/drag-drop`.
4. "Save order" button → recomputes `order` and sends `PUT`.

**Est: 1 day.**

## Phase 4 — Admin: create / edit / delete
1. Reactive Forms: `title`, `description`, `technologies` (tag add/remove), `link`, `githubUrl`, `videoUrl`, `featured`.
2. Routes `/projects/new`, `/projects/:id/edit`, delete with confirmation.
3. Validation + live card preview.

**Est: 1.5–2 days.**

## Phase 5 — Images
1. File upload (drag-drop), preview, per-project image reorder, delete.
2. Backend saves to `public/projects`, returns a relative path (as now: `projects/xxx.png`).

**Est: 1 day.**

## Phase 6 — Auth & hardening
- **Variant A (local):** simple password or none (localhost-only access).
- **Variant B/C (hosted):** full login (JWT/provider), protect all write endpoints, CORS, rate-limit. **+1–2 days.**

## Phase 7 — Build / deploy / docs
1. npm scripts for the full local cycle (`api + admin + portfolio`).
2. Update [README.md](README.md): how to edit projects via the admin and how to publish.
3. (B/C) backend deploy pipeline.

**Est: 0.5 day.**

---

## Total estimate
- **Variant A (chosen):** ~**5–6 working days**.
- Variant B (BaaS): ~7–8 days.
- Variant C (own API + hosting): ~8–10 days.

## Risks / open questions
- **Runtime data loading** slightly changes behaviour (data is fetched, not compiled-in) — must handle loading/error states.
- **Images in git** — under A, images are committed to the repo; if they grow, consider a CDN / external storage (closer to B then).
- **`shared-data` as source of truth** — after moving to JSON, both the CV build ([tools/build-cv.mjs](tools/build-cv.mjs)) and the portfolio must read from one place to avoid drift.

## Pending decisions before starting
1. **Backend for Phase 2+** — Express (simpler in this workspace) or **.NET minimal API** (closer to the user's skillset, nicer portfolio demo)? Does not affect Phase 1.
2. **Starting order** — keep current (Xpand → ISpro → AutoMall → Landing) or set a different one?
