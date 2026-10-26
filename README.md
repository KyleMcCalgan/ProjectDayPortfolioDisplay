# SpendSense Team Hub

A responsive SpendSense portfolio with two clear pages: the team directory and an app screen gallery. It uses the supplied app screenshots and official mascot artwork in a dependency-free static build for GitHub Pages.

## Run locally

Requirements: Node.js 20 or newer. No package installation is needed. In the project folder, run:

```sh
npm run dev
```

Open the **Team page** URL printed by the server. Use the **App** link in the header or open the printed `/app/` address. The preview builds with local root links, even if `BASE_PATH` is set in another terminal. If port 4173 is already occupied, it automatically selects and prints another available port. Press `Ctrl+C` in the terminal to stop it. Restart `npm run dev` after editing a profile file so it rebuilds the pages.

The project includes its own preview server; do not open `index.html` directly or use VS Code Live Server, since those can resolve the GitHub Pages asset paths incorrectly.

To build only:

```sh
npm run build
npm run check
```

## Pages and deployment

The production build writes the team page to `dist/index.html`, the app gallery to `dist/app/index.html`, one page per developer to `dist/team/<slug>/index.html`, and a GitHub Pages `dist/404.html`. All pages use the repository base path when built in GitHub Actions.

The GitHub Actions workflow in `.github/workflows/pages.yml` builds with the repository path and deploys on pushes to `main` or a manual workflow run. The public site is <https://kylemccalgan.github.io/ProjectDayPortfolioDisplay/>.

To build with the GitHub Pages path for a link check, run:

```powershell
$env:BASE_PATH="/ProjectDayPortfolioDisplay/"
npm run build
npm run check
```

## Content editing

Each developer has a folder in [`team-members/`](team-members/) containing a `profile.env` key-value file and a `cv/` folder. The site reads those files at build time. Shared app-screen descriptions and feature topics remain in [`src/data/content.js`](src/data/content.js); page templates are in [`src/template.js`](src/template.js).

The five folders are named after the developers: `Kyle McCalgan`, `Kahlan Hagerman`, `Morgan Wattrus`, `Rachel Clifford`, and `Allyson Andre`.

Each portfolio presents Profile, Work, Projects, Skills, and Contact as equal-sized swipeable panels in a fixed viewport. Long content scrolls inside its card, so it does not extend the page. Swipe horizontally on a phone, use the section buttons to jump directly to an area, or use the dot pager beneath the panel. Keyboard users can move between section buttons with the arrow keys.

### Update a team profile

Edit the person's `profile.env` file. Keep each setting on one `KEY=value` line. Comma-separated values are used for `SKILLS` and project `TECHNOLOGIES`. Use empty values when a link or detail is not available yet.

Common keys include:

```ini
NAME=Kyle McCalgan
HEADLINE=Frontend developer
BIO=Short introduction goes here.
PORTRAIT_FILE=
SKILLS=JavaScript, CSS, Accessibility
GITHUB_URL=https://github.com/username
LINKEDIN_URL=https://linkedin.com/in/username
WEBSITE_URL=https://example.org
EMAIL=name@example.org
CV_FILE=kyle-cv.pdf
```

Put each profile photo in that person's `photo/` folder. The image can have any filename; when there is one JPG, PNG, or WebP image in the folder, the build detects it automatically and `PORTRAIT_FILE` can stay empty. If there are multiple images, set `PORTRAIT_FILE` to the filename you want to use. The build copies the selected image into the generated site automatically. Keep the CV file inside that person's `cv/` folder and set `CV_FILE` to its filename.

Projects use numbered groups of keys such as `PROJECT_1_TITLE`, `PROJECT_1_SUMMARY`, `PROJECT_1_RESPONSIBILITY`, `PROJECT_1_TECHNOLOGIES`, `PROJECT_1_REPO_URL`, `PROJECT_1_DEMO_URL`, and optional `PROJECT_1_SCREENSHOT` / `PROJECT_1_SCREENSHOT_ALT`. Copy the group with the next number to add another project. Put each screenshot in that person's `projects/` folder. For example, save Kyle's Kruger Game image as `team-members/Kyle McCalgan/projects/kruger-game.jpg`, then set `PROJECT_1_SCREENSHOT=kruger-game.jpg` and add a descriptive `PROJECT_1_SCREENSHOT_ALT` in his `profile.env`. Supported formats are JPG, PNG, WebP, and SVG.

SpendSense work entries use `CONTRIBUTION_1_FEATURE_ID`, `CONTRIBUTION_1_TITLE`, `CONTRIBUTION_1_ROLE`, and `CONTRIBUTION_1_DETAIL`. The title is the specific work item shown on the profile, while the feature ID groups it with the matching app area. Feature IDs are `credit-profile`, `obligations`, `challenges`, `progress`, and `social`.

`profile.env` contains public portfolio content and is compiled into the generated pages. Do not put passwords, API keys, or other secrets there. Only publish approved portraits, contact details, links, and CVs.

### Update product screens

The screenshot selector reads `productScreenshots` in `src/data/content.js`. Images are stored in `public/assets/product/`. Update each screen's title, image path, and alt text together. Screenshots currently in the gallery were supplied for this team hub.

### Add projects and contributions

Add project entries and SpendSense contributions to that developer's `profile.env` file using the numbered key groups above. Only add contributions after the feature owner and their exact role are confirmed.

### Mascot artwork

The mascot display combines three local SVG layers in `public/assets/mascot/`: the neutral body, overalls, and sweatband. These official assets were downloaded from the public SpendSense app at <https://www.spendsense.co.za/>.

## Content still to supply

- Approved roles, introductions, portraits, projects, skills, links, and CVs for the team.
- Confirmed contribution ownership and technology details.
- Any updated app screenshots and approved descriptions.

Kyle's profile contains his submitted details, project links, contributions, and CV. The other profiles are editable starter records awaiting teammate information. The site has no backend, analytics, or runtime image dependency; photos, CVs, project previews, app screenshots and mascot artwork are served from local files.
