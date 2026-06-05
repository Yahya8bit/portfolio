# Portfolio Site

Personal developer portfolio — single-page scroll layout, inspired by the
"purplefolio" Framer template (light theme, vivid purple accent).

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion for scroll-reveal + hover animation
- lucide-react for icons
- Google Font "Poppins" for all text

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
Always run lint and a build before considering a task done.

## Design tokens (use these exact values)
- Background: #FFFFFF
- Primary text: #1B1B2F (near-black navy)
- Muted text: gray-500/600
- Primary blue: #1565C0 (main brand — section-title periods, active nav, emphasis, company names, checkmarks, inline links, project arrows, portrait ring; reads clearly as blue on white)
- Accent cyan: #29B6E8 (ONLY large/bold elements — button + hero headline gradients; never small text or thin icons)
- Hero headline first word + primary "Get In Touch" button: blue→cyan gradient (#1565C0 → #29B6E8)
- Card / image radius: ~20px
- Pill buttons: primary = blue→cyan gradient, white text; secondary = white, thin dark border

## Conventions
- Section titles always end with a cyan accent "." (e.g. "Projects" + accent period)
- Reveal animation: fade-up 20px over ~0.5s when a section scrolls into view —
  build it once as a reusable component, reuse everywhere
- One React component per section, in components/sections/
- Mobile-first; multi-column layouts stack on small screens
- Keep it accessible: semantic landmarks, alt text, keyboard-navigable tabs

## Theme
- Dark mode supported via Tailwind class strategy (`.dark` on `<html>`), default = dark.
  Toggle (sun/moon) lives in the nav. `--ink`, `--page-bg`, `--band`, `--graph-dot`,
  `--graph-line` flip in the `.dark` block in globals.css; most components adapt
  automatically via `text-ink`/`border-ink`. Add `dark:` variants for explicit
  `bg-white`/`bg-zinc` surfaces.

## Don't
- Don't add UI libraries beyond what's listed above
- Don't hardcode real personal data yet; use placeholders I'll swap later

## Always Do First

– **Load the `frontend-design` skill** at `./plugin/plugins/frontend-design` before writing any frontend code. No skipping, no exceptions, every single session.

## Reference Images

– When a reference image is given: replicate the layout, spacing, typography, and color with precision. Use placeholder content throughout (images via `https://placehold.co/`, generic copy). Nothing gets added or improved beyond what the reference shows.

– When there is no reference image: build from scratch with genuine craft (see guardrails below).

– Take a screenshot of the output, compare it against the reference, fix what is off, and screenshot again. Run at least 2 comparison rounds. Only stop when there are no visible differences left, or the user says to.

## Local Server

– **Everything gets served on localhost** — taking a screenshot from a `file:///` URL is not acceptable.

– Spin up the dev server using `node serve.mjs` (this serves the project root at `http://localhost:3000`)

– `serve.mjs` is in the project root. Get it running in the background before any screenshot step.

– Check whether the server is already up before starting it again. One instance at a time.

## Screenshot Workflow

– Puppeteer lives at `/home/yahia/portfolio/node_modules/puppeteer`. The Chrome executable is at `/home/yahia/.cache/puppeteer/chrome/linux-149.0.7827.22/chrome-linux64/chrome`.

– **Screenshots always come from localhost:** `node screenshot.mjs http://localhost:3000`

– Each screenshot is written to `./temporary screenshots/screenshot-N.png`, auto-incremented and never overwritten.

– To attach a label: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`

– `screenshot.mjs` is in the project root. Do not modify it.

– Once the screenshot is saved, read the PNG from `temporary screenshots/` using the Read tool — Claude can view and analyze it from there.

– Comparisons need to be precise: “heading is 32px but reference shows ~24px”, “card gap is 16px but should be 24px”

– Go through: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults

– One `index.html` file with all styles inline, unless told otherwise

– Tailwind CSS loaded through CDN: `<script src=”https://cdn.tailwindcss.com”></script>`

– Use `https://placehold.co/WIDTHxHEIGHT` for placeholder images

– All layouts are mobile-first

## Brand Assets

– Before starting any design work, look through the `brand_assets/` folder. It could have logos, color guides, style guides, or images.

– If something is in there, use it. Placeholders have no place when real assets exist.

– A logo in the folder gets used. A defined color palette means those exact values get used — no making up brand colors.

