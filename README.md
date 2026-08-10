# Fitness Plan

A tiny static site that is also a training coach's clipboard: weekly workout
logs with checkable days, animated exercise demos, and progress charts with
projections. Built with [Eleventy](https://www.11ty.dev/), deployed
automatically to GitHub Pages.

**Live site:** https://dpmacdonagh.github.io/fitness-plan/

## How this works (the short version)

You don't touch code. You talk to Claude Code, which acts as your coach
(its standing instructions live in `CLAUDE.md`):

- **During the week:** "check off Monday and Tuesday", "I weighed 247 this
  morning", "my left arm twinged on push-ups — note that". Claude updates the
  week's file, reacts to what you report, commits, and pushes.
- **Start of a new week:** "review my week and set up week 2". Claude reads
  your checkboxes, notes, and weigh-ins, writes coach's notes on the finished
  week, and programs the next one — easier after a rough week, slightly
  harder after a clean one.
- GitHub Actions rebuilds and redeploys the site on every push, about a
  minute later.

That's the whole loop: **talk to Claude → markdown changes → push → site
updates.** You can also edit any file by hand; checking off a day means
changing `- [ ]` to `- [x]`.

## What's on the site

| Page | What it shows |
|---|---|
| `/` | The plan overview |
| `/rules/` | Permanent training rules (spine, left arm, skin, hips) |
| `/exercises/` | Every movement with an animated stick-figure demo of correct form |
| `/nutrition/` | 16:8 eating plan + interactive week planner: tap foods into meals with live calorie/protein totals, a pantry, and a computed shopping list (saved in your browser) |
| `/weeks/` | Weekly logs, newest first, with done-counts |
| `/progress/` | Stat tiles, weight chart vs the 1–1.5 lb/wk target zone with a projection, weekly consistency chart, milestones |

## Where things live

| File | What it is |
|---|---|
| `content/weeks/week-NN.md` | One file per week: checkboxes, notes, weigh-ins |
| `content/exercises.md` | Exercise guide text |
| `content/js/rig.js` | The animated demos — a 2D bone rig; each exercise is keyframes of joint angles |
| `lib/charts.mjs` | Progress charts, rendered as SVG at build time |
| `content/progress.njk` | Progress page + milestones checklist |
| `CLAUDE.md` | The coaching protocol Claude follows |
| `.github/workflows/deploy.yml` | Build-and-deploy pipeline |

## Weekly file template

New weeks are `content/weeks/week-NN.md`. Bump `week`, set the `dateRange`,
log weigh-ins as they happen, and adjust workouts per the coach's call:

```markdown
---
title: Week NN
week: NN
dateRange: "Mon DD – Mon DD, YYYY"
weighIns:
  - date: YYYY-MM-DD
    lbs: NNN
---

Short intent line for the week. Movements: [exercise guide](/exercises/).

- [ ] **Mon** — workout description.
  - Notes:
- [ ] **Tue** — workout description.
  - Notes:
- [ ] **Wed** — workout description.
  - Notes:
- [ ] **Thu** — workout description.
  - Notes:
- [ ] **Fri** — workout description.
  - Notes:
- [ ] **Sat** — workout description.
  - Notes:
- [ ] **Sun** — workout description.
  - Notes:

---

- [ ] **Daily habits** — shower, clean clothes, BP wash on Mon/Wed/Fri.
  - Notes:
```

Weigh-ins can be added any day of the week (multiple entries are fine) — the
weight chart, pace, and projection on `/progress/` are built from them.
After a week ends, Claude appends a `## Coach's notes` section to the file.

## Running locally (optional)

```bash
npm install
npm run serve   # local preview at http://localhost:8080
npm run build   # one-off build into _site/
```
