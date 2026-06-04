# Angular Portfolio Workspace

A modern, responsive portfolio built with **Angular 20**, organised as a multi-project Angular workspace. The workspace bundles the public portfolio site, an admin app, a shared data library, and a static CV — all sharing a single canonical profile.

## 🚀 Features

- **Angular 20** with standalone components
- **Multi-project workspace** — portfolio, admin, shared library, and CV in one repo
- **Single source of truth** — profile / projects / experience live in the `shared-data` library and feed every app
- **Responsive design** with dark mode and theme toggle
- **Project gallery** with image carousel and preview
- **Contact form** wired to [Formspree](https://formspree.io/)
- **Static CV** generated from the shared profile, deployable on its own
- **TypeScript** throughout
- **GitHub Pages** ready (production build outputs to `docs/`)

## 📦 Workspace layout

```
angular-portfolio/
├── projects/
│   ├── portfolio/        # Public portfolio app (project name: angular-portfolio)
│   │   └── src/app/
│   │       ├── components/   # Reusable UI (carousel, theme toggle, …)
│   │       ├── features/     # Portfolio, project detail, contact
│   │       ├── core/         # Core services
│   │       ├── shared/       # Shared app pieces
│   │       └── models/       # App-level interfaces
│   ├── admin/            # Standalone admin app (manage projects: reorder, CRUD, images)
│   └── shared-data/      # Library: models + data (profile, projects, experience)
│       └── src/lib/
│           ├── data/         # profile.json + projects.json + *.data.ts (canonical content)
│           └── models/       # Shared TypeScript interfaces
├── cv/                   # Static CV source (index.html, styles.css, script.js)
├── tools/
│   ├── admin-api/        # Local-only .NET minimal API the admin writes through
│   └── build-cv.mjs      # Builds cv/ → dist/cv/, hydrating from profile.json
├── docs/                 # Production build output for the portfolio (GitHub Pages)
└── angular.json          # Workspace configuration
```

`shared-data` is the single source of truth. Its public API is exported from
`projects/shared-data/src/public-api.ts` and consumed by the portfolio, the admin
app, and the CV build.

## 🧰 Prerequisites

- **Node.js** 20.x or newer (Angular 20 requirement)
- **npm** 10.x or newer
- **Angular CLI** (`npm install -g @angular/cli`) — optional; you can use the local CLI via `npm run`
- **.NET SDK** 8.0 or newer — only needed to run the local admin API (`tools/admin-api`); not required to build or deploy the public site

## 🏃 Run locally

```bash
# 1. Clone the repository
git clone https://github.com/vinil2001/angular-portfolio.git
cd angular-portfolio

# 2. Install dependencies (once)
npm install

# 3. Build the shared library first — the apps depend on it
npm run build:lib

# 4. Start the app you want to work on (each runs on its own port)
npm start            # Portfolio  → http://localhost:4200
npm run start:admin  # Admin      → http://localhost:4300
npm run start:cv     # CV         → http://localhost:4400 (builds + serves dist/cv)
```

> **Tip:** Re-run `npm run build:lib` whenever you change anything under
> `projects/shared-data/` so the dependent apps pick up the new types/data.

## 🛠️ Build

```bash
npm run build:lib     # Build the shared-data library (do this first)
npm run build         # Build the portfolio → outputs to docs/
npm run build:admin   # Build the admin app  → outputs to dist/admin/
npm run build:cv      # Build the static CV  → outputs to dist/cv/
```

The portfolio production build uses base href `/angular-portfolio/` and writes to
`docs/`, which GitHub Pages serves directly.

## 🚀 Deploy

### Portfolio — GitHub Pages (from `docs/`)

```bash
npm run build         # Produces docs/
git add docs && git commit -m "build: deploy portfolio"
git push
```

In the repository settings, configure **GitHub Pages → Source → main branch /docs folder**.
The site is published at `https://vinil2001.github.io/angular-portfolio/`.

### CV — static, host anywhere

```bash
npm run build:cv      # Produces dist/cv/
```

`dist/cv/` is a self-contained static site (HTML/CSS/JS + `data.json`). Drop it on
any static host (GitHub Pages, Netlify, Vercel, S3, …). The HTML keeps real values
as a no-JS fallback; when served over http(s) it fetches `data.json` so the
deployed CV always tracks `profile.json`.

### Admin

```bash
npm run build:admin   # Produces dist/admin/
```

Deploy `dist/admin/` to any static host.

## 🎨 Customization

### Profile, projects & experience (shared content)
Edit the canonical data in the shared library:

- **Profile** (name, role, email, phone, social links): `projects/shared-data/src/lib/data/profile.json`
- **Projects**: `projects/shared-data/src/lib/data/projects.json` — edit by hand, or use the **admin app** (see below)
- **Experience**: `projects/shared-data/src/lib/data/experience.data.ts`

After editing, run `npm run build:lib` (and `npm run build:cv` if the CV is affected).

## ✏️ Editing projects via the admin

Projects live in `projects/shared-data/src/lib/data/projects.json` (each has an
`order` field that controls its position on the site). The portfolio fetches
this file at runtime, so reordering or editing is just a matter of rewriting the
JSON — which the admin app does for you through a small **local** .NET API.

```bash
# Run the admin API + admin app together (two coloured logs in one terminal)
npm run admin            # API → http://localhost:5174 , Admin → http://localhost:4300
```

Or run the two halves separately:

```bash
npm run start:admin:api  # .NET API (tools/admin-api) → :5174
npm run start:admin      # Admin app → :4300 (proxies /api → :5174)
```

In the admin you can:

- **Reorder** projects by drag-and-drop, then **Save order**
- **Create / edit / delete** projects (title, description, technologies, links, video, featured)
- **Upload images** (drag-drop or browse); files are saved to `projects/portfolio/public/projects/`

All changes are written to `projects.json` and the `public/projects/` image
folder — i.e. straight into the repo. **Nothing is live until you commit and
redeploy** (the public site stays a free static build; the admin/API are never
deployed and listen on localhost only).

### Publishing your edits

```bash
git add projects/shared-data/src/lib/data/projects.json projects/portfolio/public/projects
git commit -m "content: update projects"
npm run build            # rebuild the portfolio → docs/
git add docs && git commit -m "build: deploy portfolio"
git push
```

### Optional write protection

The API only listens on `localhost`, so local access is the security boundary.
To additionally gate writes behind a shared secret, set `ADMIN_API_TOKEN` before
starting the API and store the same value in the admin app once:

```bash
# terminal: start the API with a token
ADMIN_API_TOKEN=mysecret npm run start:admin:api
```

```js
// browser console on the admin app, once:
localStorage.setItem('adminToken', 'mysecret')
```

With no token set, the admin works with no auth (the default).

### Contact form
The contact form posts to Formspree. Update the endpoint in the portfolio's
contact feature under `projects/portfolio/src/app/features/contact/`.

### Theme colors / global styles
Edit `projects/portfolio/src/styles.scss`.

## 📝 npm scripts

```bash
npm start            # Serve the portfolio (ng serve angular-portfolio) → :4200
npm run start:admin  # Serve the admin app → :4300
npm run start:admin:api  # Serve the local admin .NET API → :5174
npm run admin        # Serve the admin API + admin app together
npm run start:cv     # Build + serve the CV → :4400
npm run build        # Build the portfolio → docs/
npm run build:admin  # Build the admin app → dist/admin/
npm run build:lib    # Build the shared-data library
npm run build:cv     # Build the static CV → dist/cv/
npm run watch         # Rebuild the portfolio on change (development config)
npm test             # Run portfolio unit tests (Karma)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: https://vinil2001.github.io/angular-portfolio/
- **CV**: https://vinil2001.github.io/cv-andrii-boiko/
- **LinkedIn**: https://linkedin.com/in/andrii-boiko

## ⭐ Acknowledgments

- [Angular](https://angular.io/) — Web framework
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework
- [Heroicons](https://heroicons.com/) — Icon library
- [Picsum](https://picsum.photos/) — Placeholder images
- [Formspree](https://formspree.io/) — Contact form backend
