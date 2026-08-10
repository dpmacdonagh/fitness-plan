# Fitness Coach

A personal training-coach app: it tells you exactly what to **do, eat,
prep, and buy** every day. React + Vite, deployed to GitHub Pages on every
push to `main`.

**Live app:** https://dpmacdonagh.github.io/fitness-plan/

## The screens

| Tab | What it does |
|---|---|
| **Today** | The prescription for right now: today's workout (with tap-to-open animated demos), today's exact meals with live calorie/protein meters, prep tasks, and habit checkboxes |
| **Week** | The same day cards for the whole week; Sunday carries the shopping list + batch-prep instructions |
| **Food** | This week's shopping list (plan minus pantry, in real package sizes) and the pantry of what you already have |
| **Progress** | Log weigh-ins, weight chart vs the 1–1.5 lb/wk target corridor with projection, weekly consistency chart, milestones |
| **Guide** | The permanent training rules and every exercise with an animated demo and form cues |

## How it updates

Talk to Claude Code (the coach — its instructions are in `CLAUDE.md`):
report what you did, your weight, how things felt. It records everything in
`src/data/weeks.js` (the permanent log), programs the next week from the
evidence, commits, and pushes. GitHub Actions rebuilds and redeploys
automatically.

Checkmarks and weigh-ins you enter in the app itself are saved on your
device (localStorage) and merged with the coach's record — tell the coach
too, so the permanent history has them.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

Data lives in `src/data/` (weeks, foods, exercises + rig animation poses).
No backend; no accounts; your interaction data never leaves your device.
