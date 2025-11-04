
---
title: "Promptly — Outcome‑First Prompt Engineering"
author: "Promptly Contributors"
output:
  html_document:
    toc: true
    toc_depth: 2
    number_sections: false
    theme: readable
    df_print: paged
---

## What is Promptly?
Promptly is a visualization‑first, outcome‑driven prompt engineering workbench. You define the **task spec** and **test cases**; Promptly then **searches**, **tests**, and **improves** prompts so model behavior converges toward the **ideal output you define**. It replaces ad‑hoc prompting with **evidence‑backed iteration**.

### Why it matters
- **Outcome‑first** — Align generation with your acceptance criteria.  
- **Evidence over intuition** — KPIs and tests tell you what works.  
- **Reusable pipeline** — Templated Spec, Tests, KPIs, and Version Evolution.

---

## Core Features
- **Prompt Enhancer** — Structures intent, optionally injects CoT for reasoning tasks, supports parameterized placeholders.
- **Validator & KPIs** — Accuracy, F1, Pass Rate, Token Cost, Progress (extensible scoring).
- **Version Evolution** — Logs each change and its **ΔAccuracy** contribution.
- **Dashboard** — Line/Bar/Pie/Gauge charts with consistent legends/units and accessible defaults.
- **Exports** — One‑click Markdown/PDF/PPTX for shareable evidence.

---

## Architecture
```
UI (Vercel)  →  API (Render)  →  Evaluator  →  Metrics Store  →  KPI Dashboard
       ↑              ↓                ↓               ↑
   Prompt Enhancer → Candidate Generation → Scoring → Version Evolution
```

- **Enhancer** converts user intent into structured prompts and can auto‑enable CoT when needed.  
- **Evaluator** runs the test suite and emits scores (Accuracy, F1, etc.).  
- **Dashboard** visualizes KPIs and the evolution timeline.

---

## Project Structure (Cloud)
```
Promptly/
├─ frontend/        # React/Vite (or similar) UI
├─ backend/         # Node/Express (or similar) API & evaluator
└─ others/          # Docs, diagrams, samples, scripts
```
**Demo mode** — Static UI preview (`index.html` can be opened directly).  
**Cloud mode** — Split frontend/backed; deploy frontend on Vercel and backend on Render.

> Packaging convention
> - **Demo version**: must include an `index.html` at the root for one‑click preview.
> - **Cloud version**: must include top‑level folders `backend/`, `frontend/`, `others/`.

---

## Quickstart

### A) Demo (Static UI)
1. Download the demo package and open `index.html` in your browser.  
2. Load the sample **Spec** and **Tests** to preview the workflow.  
3. KPIs and charts render placeholders until linked to backend data.

### B) Cloud (Vercel + Render)

**Backend**
```bash
cd backend
cp .env.example .env
# Add keys you plan to use:
#   OPENAI_API_KEY=...  (optional) ANTHROPIC_API_KEY=...  GEMINI_API_KEY=...
# If using a database:  DATABASE_URL=...
npm install
npm run dev      # or: npm run start
```

**Frontend**
```bash
cd frontend
npm install
# Configure API base
echo "VITE_API_BASE=http://localhost:10000" > .env
npm run dev
```

**Deploy**
- **Vercel (Frontend)** — import repo → set `VITE_API_BASE` → deploy.  
- **Render (Backend)** — add environment variables → use platform `$PORT` → deploy.

---

## Environment Variables
```
# Common
NODE_ENV=production
PORT=           # use platform-injected PORT on Render

# Providers (pick what you use)
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...

# Optional
DATABASE_URL=...
JWT_SECRET=...
METRICS_WRITE_KEY=...
VITE_API_BASE=https://your-backend.onrender.com
```

---

## Usage Flow
1. **Define Spec** — Goal, constraints, quality bar, and tolerances.  
2. **Write Tests** — A compact but representative set with gold answers.  
3. **Run Optimize** — Explore prompts/parameters and score candidates automatically.  
4. **Review Evidence** — Inspect KPI cards, trend charts, and the ΔAccuracy evolution timeline.  
5. **Export & Share** — Package the winning prompt and evidence as Markdown/PDF/PPTX.

---

## KPIs
- Accuracy · F1 · Pass Rate · Token Cost · Progress%  
- Optional: A/B comparisons and cost‑quality trade‑offs.

---

## Roadmap
- **v0.5.x** — UI polish, evolution timeline, data binding, export templates.  
- **v0.6** — A/B testing, team collaboration, audit trails.

---

## Contributing
Issues and PRs are welcome. Please include a minimal repro with screenshots/screencasts.

## License
MIT (unless otherwise specified for submodules).

## Acknowledgments
Lucide icons · Inter font · Vercel · Render.
