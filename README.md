# SpendSense Team Hub

A responsive, team-first portfolio site for SpendSense. Visitors meet the five developers first, then explore real app screenshots and the official mascot artwork. The site is a dependency-free static build for GitHub Pages.

## Run locally

Requirements: Node.js 20 or newer. No package installation is needed.

```sh
npm run dev
```

Open the local URL printed by the server (normally `http://127.0.0.1:4173`). To build only:

```sh
npm run build
npm run check
```

## Pages and deployment

The production build writes the homepage to `dist/index.html`, one page per developer to `dist/team/<slug>/index.html`, and a GitHub Pages `dist/404.html`. Profile links work when opened directly or refreshed.

The GitHub Actions workflow in `.github/workflows/pages.yml` builds with the repository path and deploys on pushes to `main` or a manual workflow run. The public site is <https://kylemccalgan.github.io/ProjectDayPortfolioDisplay/>.

To preview the GitHub Pages path locally, run:

```powershell
$env:BASE_PATH="/ProjectDayPortfolioDisplay/"
npm run build
npm run check
```

## Content editing

Public content is maintained in [`src/data/content.js`](src/data/content.js). The page templates are in [`src/template.js`](src/template.js).

### Add team details

Replace the five generated placeholders with each developer's approved name, role, introduction, skills, work, links, and optional public CV. Keep five profiles unless the team confirms a different number. Only publish portraits, contact details, or CVs that the relevant developer has approved.

### Update product screens

The screenshot selector reads `productScreenshots` in `src/data/content.js`. Images are stored in `public/assets/product/`. Update each screen's title, heading, description, image path, and alt text together. Screenshots currently in the gallery were supplied for this team hub.

### Add projects and contributions

Add project entries to the relevant member in `src/data/content.js` with a short summary, the developer's actual responsibility, technologies, approved images, and verified links. Add a SpendSense contribution only after its owner and exact role are confirmed.

### Mascot artwork

The mascot display combines three local SVG layers in `public/assets/mascot/`: the neutral body, overalls, and sweatband. These official assets were downloaded from the public SpendSense app at <https://www.spendsense.co.za/>.

## Content still to supply

- The five developers' approved names, roles, introductions, portraits, projects, skills, links, and CVs.
- Confirmed contribution ownership and technology details.
- Any updated app screenshots and approved descriptions.

No developer identity, personal project, contribution, CV, or product statistic has been invented. The site has no backend, analytics, or runtime image dependency; app screenshots and mascot artwork are served from local files.
