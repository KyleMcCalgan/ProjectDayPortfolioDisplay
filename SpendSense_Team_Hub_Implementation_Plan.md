# SpendSense Project Day — Team Hub

**Implementation specification for Codex**  
**Status:** Approved concept; ready for implementation with placeholder content where real team information is unavailable.  
**Target:** A mobile-first, static website hosted on GitHub Pages, focused on showcasing SpendSense and the five developers behind it.

---

## 1. Product brief

### Purpose

Build a professional, inviting digital project showcase linked from a QR code at the SpendSense Project Day stand. Visitors should quickly understand the application, explore features, discover **who built what**, and navigate to a **dedicated mini-portfolio page for each team member** containing their projects, experience, CV, and contact links.

This is **not** primarily a CV directory. The project comes first; developers are introduced through their contributions, with richer personal profiles available on click. The website should remain useful after Project Day as a shareable team and individual developer portfolio.

### Primary audience

- Project Day visitors scanning a QR code on a phone.
- Recruiters, industry representatives, lecturers, and prospective collaborators.
- Visitors returning later to review the project or connect with a developer.

### Product principles

1. **Project first, people connected to the project.** SpendSense is the narrative anchor.
2. **Fast mobile browsing.** No login, complex navigation, or unnecessary loading.
3. **Professional with subtle personality.** Clean layouts with measured SpendSense pink/white styling and small mascot interactions.
4. **Evidence over claims.** Show contributions, screenshots, code, demos, and concrete projects; avoid arbitrary skill percentage ratings.
5. **Static and maintainable.** Team information lives in editable data files; no database or backend required.
6. **Shareable.** Each developer has a stable, directly accessible URL.
7. **No invented content.** Unknown team members, achievements, dates, and responsibility assignments must use clearly marked placeholders or be hidden until populated.

### Goals and success criteria

A visitor should be able to:

- Understand SpendSense's premise within ~10 seconds of opening the page.
- Access an application demo or primary project link within one or two taps.
- Explore a feature and discover its contributors.
- Open one of five developer profile pages and see **mini-portfolio content**, not merely a business card.
- Preview/download that person's CV and open their LinkedIn/GitHub.
- Discover developers by technology or skills.
- View a short development timeline.

Do not optimize for vanity metrics or introduce tracking by default. Optionally support privacy-respecting analytics later if approved.

---

## 2. Confirmed scope and priority

### Required for first launch (MVP)

- Responsive main landing page with clear SpendSense identity, explanation, logo, and real application screenshots.
- Primary calls to action: **Explore the App**, **Meet the Team**; an external **Try/Visit SpendSense** link only if its real URL is confirmed.
- Interactive product feature explorer showing a feature description, images (when available), implementation technologies, and linked contributing developers.
- Reverse relationship on each developer page: **SpendSense Features I Worked On**.
- Five team-member cards that link to **dedicated mini-portfolio profile pages**.
- Mini-portfolios with introduction, contribution summary, selected personal projects, project images, technologies, GitHub/LinkedIn/other verified links, and CV preview/download.
- Technology/skills explorer: search and clickable filter chips that identify developers and link to their profiles; wherever possible, show supporting projects/contributions.
- Short development timeline with milestones and optional screenshots.
- One lightweight mascot Easter egg.
- Accessible keyboard-friendly navigation, descriptive alternative text, adequate contrast, responsive layouts, and reduced-motion support.
- GitHub Pages deployment and a concise README with content-editing instructions.

### Nice-to-have after MVP

- Achievement for viewing all five member portfolios; store locally, never require accounts.
- Before/after visual slider comparing early and final app screenshots, only if both real screenshots are supplied.
- Downloadable contact cards (`.vcf`), if approved contact information exists.
- Simple share actions using native Web Share API with a copy-link fallback.
- A second hidden Easter egg, only if tasteful and low-maintenance.

### Not in scope

- Authentication, accounts, hosted database, custom backend/API, CMS, comments, chat, recruiter dashboard, or complex contact forms.
- Numerical proficiency meters (e.g. "React 95%").
- Automatic GitHub scraping, live contribution scoring, fabricated stats or role descriptions.
- Submission of CVs or personal details to third-party services.
- Heavy animation, scroll hijacking, or features that block the primary calls to action.

---

## 3. Information architecture and routes

Use a single coherent branded site with **dedicated developer URLs**, not profile-only modals.

| Route | Purpose |
| --- | --- |
| `/` | Landing, app overview, features, team teaser, skills explorer, development journey, contact/footer. |
| `/team/:slug` | Shareable full mini-portfolio for a named developer. |
| `/404` or fallback | Friendly not-found page with navigation back to the hub. |

**GitHub Pages constraint:** GitHub Pages has no automatic SPA server rewrite for clean client-side routes. Choose **one** reliable routing approach and document it:

- **Preferred:** Static pre-rendered pages for `/team/<slug>/` (e.g. Astro static output) so direct links and refreshes work on GitHub Pages; **or**
- **Simpler alternative:** React/Vite with hash routes `/#/team/<slug>` and a clear note that links contain `#`.

**Do not** adopt history-mode client-side routes without implementing and testing a reliable static-host fallback.

Navigation on desktop: logo / About / Features / Team / Skills / Journey + external app link (if valid). On mobile: compact accessible menu or a simple, uncluttered header. Provide a clear **Back to SpendSense / Back to Team** link on profile pages, and preserve hash or anchor navigation when applicable.

### Home page section order

1. **Hero:** SpendSense identity, a one-sentence product pitch, real app visual, main CTAs.
2. **Why SpendSense:** Short explanation of the personal-finance/gamification premise and target user experience.
3. **Interactive Feature Explorer:** Feature selector, screenshot, concise functionality explanation, contributors and their roles.
4. **Meet the Developers:** Five polished cards (photo, name, short title, select technology tags, mini-portfolio action).
5. **Skills Explorer:** Search field, filter chips and matching developer results.
6. **Our Journey:** A concise 4–6 milestone timeline, optionally with screenshots.
7. **Final CTA + Footer:** Visit project, view repository if approved/public, team links, short credit and optional sponsor acknowledgement (EPI-USE only if team approves exact wording/asset).

Avoid repeating long profile content on the homepage. The homepage should be scannable; the developer pages contain the depth.

---

## 4. Detailed page requirements

### 4.1 Hero

- Clear title, e.g. **“Meet the Team Behind SpendSense.”**
- Support line explaining the application without buzzwords.
- Logo and one high-quality, real screenshot/mockup of the application.
- Primary CTA **Explore the App** scrolls to feature explorer, or a separately labeled external **Open App** when a confirmed URL is configured.
- Secondary CTA **Meet the Team** scrolls to team cards.
- Optional Project Day / University of Pretoria / class-of-2026 context, but show only accurate approved details.

### 4.2 Feature explorer — key differentiator

Feature selection should work with tabs, segmented controls, or cards. For each feature display:

- Name, plain-language purpose, and at least one screenshot if provided.
- Technologies / implementation categories where factual.
- **Contributors:** developer photo/name, specific responsibility (e.g. frontend UI, backend API), link to mini-portfolio.
- Optional "Learn about implementation" expandable note; keep it short and visitor-friendly.

Seed feature *categories* from known SpendSense ideas, but confirm current implementation before labeling anything as delivered:

- Simulated Credit Score / credit-profile events.
- Obligations calendar and payment tracking.
- Gamification, challenges, achievements and rewards.
- Mascot and user progression/knowledge streak.
- Friends/social challenges and wagers, if included in the final product.
- Notifications and profile, if appropriate.

**Critical:** Do not guess ownership. `contributions` must be an explicit mapping maintained in data and remain unassigned/hidden when unknown.

### 4.3 Team grid

Five consistent cards, each with:

- Photo or polished initials placeholder.
- Full name (placeholder until supplied), short professional heading, 2–4 representative skills.
- Brief one-line introduction or interests.
- Clear **View Portfolio** action.
- Accessible clickable area and meaningful focus state.

Do not auto-generate fictitious individuals or attribute skills arbitrarily.

### 4.4 Dedicated developer mini-portfolio (`/team/:slug`)

This is intentionally a **substantial page**, not a small popup or contact card.

Recommended section order:

1. **Profile hero** — headshot, name, preferred role/headline, 2–3 sentence bio, selected skills; actions for GitHub, LinkedIn, email (if approved), CV.
2. **My SpendSense Contributions** — list of features linked back to the feature explorer, with clear descriptions of the work they actually did (and optional challenge/outcome).
3. **Selected Projects** — 2–4 project cards (responsive image, project name, problem/use case, personal responsibilities, stack, repository, demo if available).
4. **Project details** — optional expandable detail panel or dedicated anchored sections. Screenshots can open in an accessible lightbox only if straightforward to implement; native links are acceptable for MVP.
5. **Skills & Technologies** — grouped by category, with references to evidence/project experience where possible.
6. **CV viewer** — inline PDF preview, **Open in New Tab**, and **Download PDF**. Do not depend solely on browser PDF embedding: fallback when unavailable and provide accessible links.
7. **Contact and connect** — professional links, optional mailto, and back-to-team navigation.

Use stable slugs (e.g. `first-last`) but populate only from real names. External links should open in a new tab with appropriate `rel="noopener noreferrer"` where used.

### 4.5 Searchable skills explorer

- Search text filters technology names and optionally project names/descriptions.
- Select one or several skill chips; by default treat multiple skills as **AND** filtering, with clear indication and a reset button. Optionally provide OR choice later, but do not complicate MVP.
- Display matched developers with skill evidence, feature contributions and/or selected personal projects.
- No numeric proficiency percentages.
- Empty state: “No matching team members — try another skill.”
- Keyboard operation and clear filter state.

### 4.6 Journey/timeline

Use 4–6 short editable milestones, for example:

1. Idea and problem discovery.
2. First prototype and architecture.
3. First working demo.
4. Expanded features and gamification.
5. Refinement/testing/integration.
6. Project Day.

These are **suggested headings**, not verified historical facts. Only display confirmed dates, screenshots, descriptions, and milestones. A vertical timeline is ideal on mobile; a restrained horizontal or alternating timeline is optional for desktop.

### 4.7 Easter eggs

Required: a small mascot interaction, e.g. click/tap to change expression or show a random friendly fact. No interruption or surprise audio.

Optional: “Met the whole team” achievement after visiting all five unique profile pages, persisted via local storage where available. It must not collect identifying data; it should be dismissible, keyboard accessible, and should respect reduced motion.

---

## 5. Visual design direction

**Tone:** professional developer showcase with subtle SpendSense personality, not a cartoonish game interface and not a generic corporate template.

- **Palette:** bright white/off-white canvas; restrained pink/magenta highlights; dark neutral text. Derive exact color tokens from the existing SpendSense brand/logo when available (do not invent "official" colors).
- **Typography:** modern readable sans-serif with strong typographic hierarchy; avoid huge amounts of tiny decorative text.
- **Layout:** generous whitespace, clear max-width content container (~1100–1200px), considered visual rhythm, responsive grids.
- **Cards:** simple and confident rather than excessive rounded-card overload. Use soft borders, restrained shadows and thoughtful interactions.
- **Imagery:** real SpendSense screenshots/brand assets and real team/project photos; consistent aspect ratios and image treatment.
- **Mascot:** secondary design detail, not the hero's primary focus.
- **Motion:** very subtle hover/section transitions; disabled or reduced via `prefers-reduced-motion`.
- **Mobile:** design at ~360px width first. Make all buttons/touch targets comfortable, prevent horizontal scrolling, avoid full-screen overlays for critical features.
- **Desktop:** more generous profile layouts, side-by-side CV preview/details where appropriate, but preserve natural reading order.

Do not treat visual inspiration mockups as actual application assets. Do not use random generic stock photos as substitute team headshots.

---

## 6. Recommended implementation approach

### Static architecture

**Preferred option:** Astro static-site generation with TypeScript and lightweight interactive islands where necessary (feature explorer, skills filtering, Easter egg), deployed to GitHub Pages.

Why: first-class output of distinct static profile routes, SEO/social metadata for each page, minimal JavaScript, direct-link reliability on static hosting.

**Acceptable alternative:** React + Vite + TypeScript if the team prefers familiarity, using hash-based navigation for GitHub Pages or a tested static-page generation strategy. Do not use a backend.

Codex should inspect the repository first (if it exists), reuse existing stack/conventions when practical, and **not** make a gratuitous rewrite merely to follow the preferred choice.

### Suggested code structure (Astro example)

```text
/
├── public/
│   ├── assets/
│   │   ├── brand/           # approved logo, mascot
│   │   ├── screenshots/     # actual SpendSense screenshots
│   │   ├── team/            # approved portraits
│   │   └── projects/        # personal project images
│   └── cvs/                 # approved public PDF CVs
├── src/
│   ├── data/
│   │   ├── site.ts
│   │   ├── members.ts
│   │   ├── features.ts
│   │   ├── timeline.ts
│   │   └── skills.ts         # optional if derived automatically
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── FeatureExplorer.*
│   │   ├── FeatureContributor.*
│   │   ├── TeamCard.astro
│   │   ├── SkillExplorer.*
│   │   ├── Timeline.astro
│   │   ├── ProjectCard.astro
│   │   ├── CvPreview.astro
│   │   ├── MascotEasterEgg.*
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── team/
│   │       └── [slug].astro
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── paths.ts
│       └── content.ts
├── .github/workflows/deploy.yml
├── README.md
├── package.json
├── tsconfig.json
└── astro.config.mjs
```

The `*` extension indicates an interactive component in the chosen framework; choose the simplest suitable island/component solution, not a heavy state-management dependency.

### Deployment path requirement

GitHub Pages project sites may live under `https://<owner>.github.io/<repo>/`, while a custom domain can host at the root. Centralize **base-path-aware asset and navigation URL construction** and test both path modes. Never assume `/assets/...` works on project Pages paths. If a real custom domain is used, provide deployment instructions but do not alter DNS without explicit authorization.

---

## 7. Editable data model

All member, feature and timeline content should come from typed structured files so updates require no component rewrites.

Example types (illustrative, not actual staff data):

```ts
export type Project = {
  id: string;
  title: string;
  summary: string;
  responsibility?: string;
  technologies: string[];
  screenshots: string[];
  repoUrl?: string;
  demoUrl?: string;
};

export type Member = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  portrait?: string;
  skills: string[];
  projectIds: string[];
  projects: Project[];
  links: {
    github?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
  cvPdf?: string;
  isPublished: boolean;
};

export type Contribution = {
  memberId: string;
  role: string;             // actual responsibility, not inferred
  detail?: string;
};

export type ProductFeature = {
  id: string;
  title: string;
  summary: string;
  description?: string;
  screenshots: string[];
  technologies: string[];
  contributions: Contribution[];
  isPublished: boolean;
};

export type Milestone = {
  id: string;
  label: string;
  dateLabel?: string;      // only if confirmed
  description: string;
  image?: string;
  isPublished: boolean;
};
```

**Content consistency:**

- `memberId` in each feature contribution must refer to an existing member.
- The member's SpendSense contributions are **derived from feature relationships**, not duplicated manually with conflicting values.
- `projectIds` is optional if project data is already nested; avoid redundant content models in the final design. Choose one consistent source of truth.
- Every published profile must have a unique slug, meaningful name and required text.
- Hide buttons when their URLs or PDFs are absent; never use `href="#"` as a fake link.
- URLs, screenshots and PDFs must be validated, accessible, and correctly resolved under GitHub Pages base paths.
- Placeholder profiles may exist for layout previews, but **never appear to be factual biographies**. Until real content is provided, show visible "Content pending" indicators or keep profiles unpublished.
- To preserve the five-card stand layout before data arrives, use five explicitly marked placeholder cards or a safe editable demo fixture, not invented identities.

### Content input checklist (to gather from team)

For each of the **five** developers:

- Approved full name, preferred slug, headshot, role/headline, short bio.
- Approved skill tags and supporting project information.
- Two to four personal projects: title, description, specific role, stack, image(s), GitHub URL, demo URL if any.
- Verified SpendSense features worked on and exact responsibility per feature.
- GitHub URL, LinkedIn URL, optional website and public contact email.
- Explicitly approved **public-facing** CV PDF, stripped of information not intended for public distribution.

For SpendSense:

- Approved logo, mascot artwork, screenshots, concise description/tagline.
- Confirmed public website/demo and repository URLs, if sharing permitted.
- Confirmed feature list and ownership mapping.
- Actual dates/screenshots for development milestones.
- Approved acknowledgement copy/assets for university, sponsor or partners, if any.

---

## 8. Functional behaviours and edge cases

### Navigation

- All main sections reachable by menu/anchor.
- Feature card selection updates visual content and contributor links without page reload.
- Profile links are stable and survive hard refresh/direct entry on Pages.
- Return links on profiles point to team section or relevant feature section; preserve context when sensible.

### CV previews

- Inline `<iframe>`/`<object>` with descriptive accessible title, height control and direct download/open actions.
- Mobile browsers may not support inline PDF preview: show a well-designed fallback plus external open/download.
- Only fetch an actual PDF if `cvPdf` is supplied; no placeholder broken embeds.
- Set download filename to something understandable, e.g. `Firstname_Lastname_CV.pdf` if valid.

### Filtering

- Query matching is case-insensitive.
- Skill selection is visually clear and removable.
- Nonmatching developers disappear or are explicitly excluded.
- Empty state and reset action.
- Never infer skill endorsements solely from a single feature association unless team confirms.

### Images

- Provide reasonable sizes, `loading="lazy"` for below-fold content, alt text, and aspect-ratio constraints.
- If screenshots are missing, use a labeled branded placeholder rather than unrelated stock media.
- Avoid publicly exposing private repository screenshots or other information not approved for publication.

### Performance and offline assumptions

- Site should work without a backend once static files load.
- Avoid large libraries for a single filter, heavy video autoplay, and embedding many CVs on the homepage.
- Render CV on its own profile view only, and preferably lazy-load it when in view or on user action.
- Optional local storage only for the Easter egg; the site must remain functional when storage is unavailable.

---

## 9. Accessibility, privacy and SEO

**Accessibility:** semantic landmarks, one H1 per page, logical heading nesting, visible keyboard focus, keyboard-operable filters/tabs, labeled controls, accessible tab semantics if tabs are used, adequate color contrast, descriptive link names, no information conveyed solely by color, mobile touch targets, reduced-motion handling, and informative alt text.

**Privacy:** team members approve every public photo, CV, link and contact detail. Avoid mobile numbers and residential addresses. Review CVs for personal identifiers before publication. No analytics/cookies without a deliberate decision. Do not persist visitor information.

**SEO/social:** sensible `<title>` and meta descriptions per page, Open Graph tags, canonical URLs if final domain known, favicon, meaningful share preview image using approved brand assets, and noindex for unpublished/staging demos if appropriate.

**Security:** do not commit secrets or `.env` credentials; no client-side API keys; sanitize or avoid raw HTML in content; safe external links; keep dependencies reasonably current.

---

## 10. Build phases for Codex

### Phase 0 — Repository assessment

1. Inspect existing repository, package manager, scripts, assets, Pages configuration and README.
2. Identify whether project already uses React/Vite/Astro; follow existing conventions if suitable.
3. State selected routing and deployment approach in README, especially direct URLs and base paths.
4. Do not remove or overwrite existing user work without reason.

**Output:** project skeleton and a short decision log in README.

### Phase 1 — Brand foundation + homepage shell

1. Establish CSS tokens/theme, typography, responsive container, header/footer.
2. Build homepage hero and overview sections.
3. Create data files/typed models; add clearly identified placeholder content for missing supplied assets.
4. Build a strong mobile layout and desktop adaptation.

**Acceptance:** homepage loads locally, looks coherent at phone/desktop widths, navigation works.

### Phase 2 — SpendSense feature explorer

1. Render features from data.
2. Implement selection and screenshot presentation.
3. Render contributor links from actual `contributions` mapping.
4. Validate missing/empty states and data references.

**Acceptance:** features switch correctly; no fictitious attribution; contributor links resolve.

### Phase 3 — Team grid and full mini-portfolios

1. Build five homepage member cards.
2. Implement separate, directly accessible profile routes.
3. Add substantial per-member project galleries and SpendSense contribution lists.
4. Add professional links and inline CV with fallback/download controls.
5. Add per-profile metadata.

**Acceptance:** all five designated profiles have distinct URLs; hard refresh works on deployed hosting; missing CVs/links do not break the UI.

### Phase 4 — Searchable skills + timeline

1. Build keyword search and selectable skill chips.
2. Implement filtering and result cards with evidence.
3. Implement editable timeline and graceful missing imagery.

**Acceptance:** filter combinations and reset behave predictably; empty states are useful.

### Phase 5 — Polish and Easter egg

1. Add mascot click/tap interaction.
2. Optional exploration achievement if time allows, without accounts.
3. Optional before/after slider only with real source screenshots.
4. Apply focus, contrast and reduced-motion refinements.

**Acceptance:** extras do not obstruct browsing and work via keyboard/touch.

### Phase 6 — QA, deployment and documentation

1. Run local production build and available lint/type checks/tests.
2. Test direct deep links and asset paths under a Pages project subpath.
3. Build GitHub Actions Pages workflow using the repository's selected build tool.
4. Verify published site on mobile and desktop sizes.
5. Write content-editing and deployment instructions; list all remaining placeholder content.

**Acceptance:** deploy is repeatable, URLs resolve, site runs without a backend.

---

## 11. Testing matrix

| Test | Expected |
| --- | --- |
| Open homepage at 360px width | No horizontal overflow; text and CTAs readable. |
| Open at 768px and 1440px | Clear responsive layout and image scaling. |
| Select every feature | Correct description/screenshots/contributors shown. |
| Click contributor from feature | Correct dedicated portfolio opens. |
| Click contribution from portfolio | Correct homepage feature accessible. |
| Open each profile URL directly and refresh | Works on GitHub Pages, not 404. |
| Missing CV / URL / photo | Honest fallback; no broken button. |
| Preview CV on mobile unsupported browser | Open/download remains available. |
| Search mixed-case skill | Matching results returned. |
| Select two skill chips | Consistent AND semantics; reset works. |
| Search nonexistent skill | Friendly empty state. |
| Navigate with keyboard only | All actions possible; visible focus. |
| Enable reduced motion | No essential animation; effects minimized. |
| Test external links | Approved URLs only; safe new-tab handling. |
| Open app from QR code | Correct mobile-friendly landing page. |
| Deploy under `/<repo>/` | Assets and internal links work without root-path assumptions. |

Where practical, automate type/content validation and route checks. Avoid adding large testing dependencies unless justified.

---

## 12. Deployment plan

1. Use a public repository where appropriate (the site's source and public CV assets will be visible), or check current GitHub Pages plan/repository eligibility before selecting private repo hosting.
2. Configure site static build output (e.g. Astro `dist/`).
3. Set site URL and base path for the chosen GitHub Pages URL.
4. Create GitHub Actions workflow triggered by push to intended branch, build production output and deploy to Pages with GitHub's supported Pages actions.
5. Enable Pages using **GitHub Actions** as source, and confirm workflow permissions/config.
6. Test direct profile link opening and reload, screenshot paths, PDFs, and social preview.
7. Optionally configure a subdomain such as `team.spendsense.co.za`, **only after domain ownership and the desired configuration are confirmed**. Include DNS/Pages instructions but don't modify infrastructure automatically.
8. Print a QR code only after verifying the final live URL and mobile experience. Place it on Project Day materials.

If using a repository under an organisation, ensure Pages and Actions are allowed by its settings.

---

## 13. Definition of done

The site is ready for Project Day when:

- [ ] Professional branded homepage clearly explains and showcases SpendSense.
- [ ] Project features can be explored interactively.
- [ ] Real contributor information links features to developers and vice versa.
- [ ] Exactly five approved developer entries are represented (or incomplete ones conspicuously marked until approved).
- [ ] Each developer has a working standalone mini-portfolio URL with projects and professional links.
- [ ] Every supplied CV can be viewed or opened and downloaded.
- [ ] Skills search and filtering work on mobile and desktop.
- [ ] Timeline is concise, factual and visually consistent.
- [ ] Mascot Easter egg works but does not disrupt primary functionality.
- [ ] No invented member details, false contributions, empty dead-end buttons or broken links.
- [ ] Navigation is accessible, performant, responsive and reduced-motion aware.
- [ ] GitHub Pages build/deployment succeeds; profile deep links and refreshes work.
- [ ] README explains adding/updating members, features, projects, timeline, assets and CVs.
- [ ] Team has signed off public personal information and final QR code URL.

---

## 14. Instructions to Codex — execution contract

**Goal:** Implement this website end-to-end, not merely design a mockup or write a proposal.

1. Read this specification completely, inspect the working repository and existing assets before coding.
2. Prefer the current stack if appropriate; otherwise choose a simple static-site architecture and explain the choice in README.
3. Build a **real working site** with navigation, filtering, feature selection, portfolio routes, functional links where real URLs exist, CV support, and deployment configuration.
4. Use approved brand assets when present. If not, create neutral branded text/layout placeholders; do not fabricate screenshots, headshots, CVs, personal projects or contributor attribution.
5. Include content fixtures/templates so the five member profiles can be populated easily. Make missing data explicit and give maintainers an actionable checklist.
6. Keep all visible text and assets editable from structured data where sensible; avoid duplicating content across pages.
7. Implement features in the phase order above. Check compilation, type safety and important interactions as work proceeds.
8. Ensure direct shareable portfolio links work **after deployment to GitHub Pages**, not just in the development server.
9. Complete and test the production build, validate basic responsive/accessibility flows, then report any blockers or incomplete content honestly.
10. Deliver updated code, a useful README, any necessary workflow/configuration files, and a short final summary covering what was built, how to run/deploy it, and the content the team must still provide.

### Suggested prompt to initiate Codex

> Read `SpendSense_Team_Hub_Implementation_Plan.md` in full and implement the complete SpendSense Project Day Team Hub in this repository. First inspect the existing repository, dependencies, brand assets, and deployment configuration. Use the spec as the source of truth. Prioritize the project showcase, interactive feature-to-developer attribution, and **dedicated full mini-portfolio pages** for each of five members. Keep the site static, mobile-first, professional with subtle SpendSense pink styling, accessible, and GitHub Pages compatible. Implement working functionality and content-driven components, rather than static mockups. Use clearly identified placeholders for any unavailable personal data; do not invent developer identities, achievements, links, screenshots, or contributions. Run relevant checks and production builds, fix problems, document setup/deployment/content editing, and give a precise completion summary with outstanding real-content requirements.

---

## 15. Open content decisions (do not block initial build)

These items require team-provided materials, but Codex can build the structure immediately:

- Names, photos, headlines, bios and skill claims for all five members.
- Actual project gallery items for each developer, including screenshots/repos/demos.
- Public CV PDFs and consent to publish them.
- Actual mapping of developers to SpendSense features and exact responsibilities.
- Verified current SpendSense features and screenshots.
- Confirmed app/repository links and sponsor/university acknowledgements.
- Actual development milestone dates and historic screenshots.
- Choice of final GitHub Pages project URL vs custom subdomain.

**Final design decision already made:** Clicking a team member should navigate to their **own dedicated mini-portfolio**, with a shareable URL and enough content to stand on its own, rather than merely expanding a business-card popup.
