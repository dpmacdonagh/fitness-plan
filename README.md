# Fitness Plan

A tiny static site for tracking a weekly training plan. Built with [Eleventy](https://www.11ty.dev/), deployed automatically to GitHub Pages.

**Live site:** https://dpmacdonagh.github.io/fitness-plan/

## How to update it (the short version)

You don't need to touch any code. Just talk to Claude Code:

1. Tell Claude what changed — "check off Monday and Tuesday in week 1", "add a note that my knee felt off on Thursday", "create week 2".
2. Claude edits the markdown files in `content/`, commits, and pushes.
3. GitHub Actions notices the push to `main`, rebuilds the site, and redeploys it to GitHub Pages automatically. The live site updates in about a minute.

That's the whole loop: **edit markdown → commit → push → Actions redeploys.**

You can also edit the files by hand — they're plain markdown. Checking off a day means changing `- [ ]` to `- [x]`.

## Where things live

| File | What it is |
|---|---|
| `content/index.md` | The plan overview |
| `content/rules.md` | Permanent training rules |
| `content/weeks/week-01.md` | Weekly logs, one file per week |
| `content/_includes/base.njk` | The one page layout |
| `content/css/style.css` | The one stylesheet |
| `.github/workflows/deploy.yml` | The build-and-deploy pipeline |

The weeks index at `/weeks/` lists every week automatically, newest first — just add a new file and it shows up.

## Adding a new week

Create `content/weeks/week-NN.md` (e.g. `week-02.md`) using this template. Bump `week`, update the `dateRange`, and adjust the workouts as the plan progresses:

```markdown
---
title: Week NN
week: NN
dateRange: "Mon DD – Mon DD, YYYY"
---

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

## Running locally (optional)

```bash
npm install
npm run serve   # local preview at http://localhost:8080
npm run build   # one-off build into _site/
```
