# The Global Culinary Explorer & Smart Grocery Assistant

## a. Name
Mary Nacouzi — Lebanese University, Faculty of Engineering

## b. API Used
**Spoonacular API** — used for dynamic recipe search and recipe detail
lookups on the Home page and the recipe details page. The API key is
never exposed to the browser: all requests are routed through backend
proxy endpoints (`/api/spoonacular/search` and `/api/spoonacular/recipe/:id`)
in `server.js`, which attach the key server-side before calling Spoonacular.

## c. Project Description
A full-stack web application for exploring global recipes, managing a
custom grocery checklist, and browsing a curated archive of authentic
Lebanese dishes. It's built with a strict separation of concerns:
semantic HTML5 for structure, a single hand-written `paragraph.css` for
styling, and standalone ES6 classes for all client-side behavior — no
frameworks, no jQuery.

Four pages:
- **Home** — dynamic recipe search via the Spoonacular API, with results
  linking to a shareable recipe details page.
- **Recipe Lab** — a community submission form with regex-validated
  fields, storing entries in a Neon PostgreSQL database.
- **Grocery Assistant** — a fully interactive checklist with full CRUD
  (add, check off, delete) backed by the same database. Each visitor is
  assigned a private, anonymous session on first visit, so one person's
  checklist never overlaps with anyone else's.
- **Beirut Bites** — a hand-curated archive of 18 authentic Lebanese
  dishes with live client-side search/filter and individual detail pages.

Backend: Node.js + Express, serving the static frontend and exposing REST
endpoints backed by a serverless Neon PostgreSQL database. Deployed on
Vercel.

## d. Custom Requirement Explanation
**Unique UI requirement — translucent sticky top navigation bar.**
A `position: sticky` navbar (`.custom-sticky-nav`) sits at the top of
every page, using `backdrop-filter: blur(12px)` over a semi-transparent
background so it stays legible and pinned in place while the page scrolls,
regardless of content length. It carries the four required internal links
(Home, Recipe Lab, Grocery Assistant, Beirut Bites), with the active page
underlined for orientation. The implementation is documented inline with a
`DEVELOPER LOG` comment directly above the rule in `public/css/paragraph.css`.

Two further enhancements built on top of the base requirements:
- A **flexbox sticky footer** (`body` as a column flex container with
  `main { flex: 1 0 auto }`) keeps the footer anchored to the bottom of
  the viewport on every page, even when content is short.
- A **URL-driven recipe/dish details system** (`recipe-details.html?id=&source=`,
  `beirut-bite-details.html?id=`) so any recipe or dish card can be opened
  as its own shareable, linkable page with full ingredients/instructions,
  rather than only being viewable inline in a list.  
  - **Per-session grocery list isolation.** The Grocery Assistant originally
  used a single shared table with no owner, meaning every visitor saw and
  could edit the same list — a usability flaw discovered after initial
  testing. It was fixed by assigning each browser an anonymous, unguessable
  session id via an `httpOnly` cookie on first visit, and scoping every
  grocery query (`GET`/`POST`/`PUT`/`DELETE`) to that id, so each visitor
  now has a private checklist without requiring a full login system.

## e. AI-Use Appendix

**Tool used:** Claude (Anthropic), via the claude.ai chat interface.

**How it was used, in the order it happened:**
1. Uploaded the instructor's requirements PDF and the project description
   file, and asked Claude to propose a phased build plan before writing
   any code.  
   The prompt given was:  
   "The Global Culinary Explorer & Smart Grocery Assistant is a clean, minimalistic full-stack web application designed for the Lebanese University Faculty of Engineering that strictly adheres to a traditional, modular separation of concerns. The frontend architecture completely isolates semantic HTML5 files for structure , a dedicated hand-written paragraph.css file for styling , and standalone client-side JavaScript files powered by modern ES6 classes to manage dynamic UI interactions. This frontend serves four distinct pages via a consistent, translucent sticky top navigation bar featuring four required internal links : the Home page handles dynamic food queries via the key-authenticated Spoonacular API; The Recipe Lab captures community custom recipes through a validated submission form ; the Grocery Assistant offers a fully interactive shopping checklist; and Beirut Bites preserves an archive of over 15 authentic, curated Lebanese dishes to ensure zero placeholder content on the site. Operating quietly in the background, a lightweight Node.js and Express backend hosts these static public files and manages secure backend routing to a serverless Neon PostgreSQL database layer, with the entire integrated repository deployed live on Vercel. Visually, the interface embraces your exact organic color palette—anchored by a pristine off-white background (#FBF9F5) and rich olive green typography (#4F622E), accented by smooth sage (#C3D09A) and active mustard yellow highlights (#EABA4A), and housed in soft cream containers (#FEEABC)—finished with intentional micro-animations applied exclusively to form transitions and checklist entry states to guarantee a premium, modern, and uncluttered user experience.
   so based on the two files i uploaded for this project, a pdf with all the requirements specified by the instructors and the txt file describing the website, help me build this website. 
   note i want to implement this project in phases not all at once, so recommend the plan we'll follow"   
> *Note: Later on, I decided to change the style of the website.* 
2. Asked Claude to scaffold Phases 1–3 together: the Express server,
   Neon schema, the four HTML pages with the sticky navbar, the
   `paragraph.css` styling, and the three core ES6 classes
   (`SpoonacularSearch`, `RecipeLabManager`, `GroceryListEngine`).
3. Asked Claude to build Phase 4 (the 18-dish Beirut Bites dataset and
   filter class) and Phase 5 (README, deployment/screenshot instructions)
   as a second pass, once Phase 1–3 was confirmed running locally.
4. Asked Claude to add two architectural upgrades afterward: a sticky
   flexbox footer, and a URL-driven recipe details page — requesting only
   the changed/new files rather than a full project re-export each time.  
   The prompt given was:  
   "To elevate the project's usability and professional polish, two key architectural upgrades will be implemented. First, a "Sticky Bottom Footer" will be established using a flexbox-based layout; by setting the page container to a minimum viewport height of 100vh and allowing the main content area to expand dynamically, the footer will be permanently anchored to the bottom of the screen regardless of content length, ensuring a consistent and refined visual experience across every page. Second, the navigation will transition from a single-page search interface to a "URL-Driven Detail System," where clicking a recipe card redirects the user to a dedicated details page (e.g., /recipe-details.html?id=...). This page will dynamically fetch and render comprehensive ingredient lists and step-by-step instructions based on the unique identifier in the URL, providing a distraction-free environment for cooking while enabling users to share direct links to their favorite culinary discoveries.
   so implement these changes for me. Note: don't generate me a new zip file containing all the files, just guide me through the changes needed to be done if the modifications are minor, and if there's a lot of changes or a new files has to be added, provide me only with these updated or modified files, not all the project's files."
5. Asked Claude to extend the same details-page pattern to the Beirut
   Bites section.
6. Asked Claude to restyle the site twice from reference images: first
   toward a serif/red-accent editorial look, then toward a fully neutral
   off-white/charcoal palette where only the food photography supplies
   color.  
   The prompt given was:  
   "Now i would like to enhance the design of our website so that it mimics the style of the one in the photo i uploaded.
   To mimic the design style seen, focus on these five core pillars of minimalist, high-end culinary web design:

   Prioritize Negative Space: Use generous amounts of whitespace (padding and margins) to isolate elements, ensuring the interface feels airy, uncluttered, and sophisticated.
   Immersive Photography: Content should be driven by high-quality, bright, and vibrant food imagery; the photographs are not just illustrations but are the primary aesthetic elements of the layout.
   Refined Typography: Employ a clear visual hierarchy by pairing a sophisticated, elegant serif font for headings (titles/recipe names) with a clean, highly legible, modern sans-serif font for body text and navigation links.
   Minimalist UI Components: Keep navigation headers sparse and balanced, and use subtle, clean input bars for newsletter or search features to maintain a high-end feel without causing visual noise.
   Structured Grid Layout: Organize content in a consistent, orderly grid that combines large hero sections for featured items with uniform, smaller cards for secondary content, creating a rhythm that is both structured and easy to scan.

   don't make dramatic changes, and provide me only with the modified files, also let the pop of color be some shade of red."  
8. Reported that the Grocery Assistant was using a single shared list
   visible to every visitor, and asked Claude to fix it.

**What the AI got wrong, and how it was corrected:**
   The first backend implementation stored
   grocery items in one shared table with no concept of "whose" list an
   item belonged to — functionally fine for a demo, but a real usability
   bug once more than one person could use it at once. This wasn't caught
   until the app was actually used and the shared-state behavior was
   noticed and reported. The fix required a schema change (`session_id`
   column), a new cookie-based session middleware, and rewriting all
   four grocery routes to scope by session — a good example of a design
   flaw that only becomes obvious through real usage, not code review.



