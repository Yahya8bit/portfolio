# Mohamed Yahia Gazzeh — Portfolio

Personal portfolio of **Mohamed Yahia Gazzeh**, a software engineering student at
ENSI (Manouba, Tunisia). A single-page, animated site with light/dark themes,
an ENSI-inspired blue palette, and a full-page animated node-graph background.

## ✨ Features

- **Single-page scroll layout** — Hero, Projects, Education, Activities, Skills,
  My Story, Contact, with sticky scroll-spy navigation.
- **Dark mode** (default) with a one-click light/dark toggle.
- **Animated node-graph background** — a lightweight `<canvas>` network of
  connected dots, themed and `prefers-reduced-motion` aware.
- **Projects** pulled from real GitHub repositories.
- **Contact form** wired to [Formspree](https://formspree.io/) with success/error
  states, plus direct email / LinkedIn / GitHub links.
- **Downloadable CV** and fully responsive, accessible markup.

## 🛠 Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for scroll reveals
- [lucide-react](https://lucide.dev/) icons
- Google Font **Poppins**

## 🚀 Run locally

```bash
# 1. Clone
git clone https://github.com/Yahya8bit/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser.

## 📦 Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## 📁 Structure

```
app/                 # Next.js App Router (layout, page, global styles)
components/          # shared components (NodeGraph, NavLinks, ThemeToggle, ui)
components/sections/ # page sections (Hero, Projects, Education, …)
public/              # static assets (logos, images, resume.pdf)
```

## 📫 Contact

- Email: mohamedyahia.gazzah@ensi-uma.tn
- LinkedIn: https://www.linkedin.com/in/yahya-gazzeh-348328305/
- GitHub: https://github.com/Yahya8bit
