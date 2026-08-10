// Build-time SVG charts for the progress page. No client JS — charts are
// rendered during the Eleventy build from weekly-file frontmatter and
// checkbox state. Colors come from CSS custom properties (see style.css)
// so the charts follow the site's light/dark theme.
import fs from "node:fs";

export const PLAN = {
  startDate: "2026-08-10",
  startLbs: 250,
  goalLow: 225,
  goalHigh: 230,
  endDate: "2026-12-31",
  rateLow: 1.0, // lb/week — slow edge of the target corridor
  rateHigh: 1.5, // lb/week — fast edge
};

const WEEK_MS = 7 * 24 * 3600 * 1000;
const d = (s) => new Date(s + "T00:00:00Z").getTime();

// ---- data extraction --------------------------------------------------------

export function weighIns(weeks) {
  const out = [];
  for (const w of weeks) {
    for (const wi of w.data.weighIns || []) {
      const date = wi.date instanceof Date ? wi.date.toISOString().slice(0, 10) : String(wi.date);
      out.push({ date, lbs: Number(wi.lbs) });
    }
  }
  out.sort((a, b) => d(a.date) - d(b.date));
  return out;
}

export function adherence(week) {
  // Count markdown task checkboxes in the week's source file.
  const raw = fs.readFileSync(week.inputPath, "utf8").replace(/^---[\s\S]*?---/, "");
  const boxes = raw.match(/^\s*- \[[ xX]\]/gm) || [];
  const done = boxes.filter((b) => /\[[xX]\]/.test(b)).length;
  return { done, total: boxes.length, pct: boxes.length ? Math.round((100 * done) / boxes.length) : 0 };
}

function regression(points) {
  // least-squares lb-per-week over the given weigh-ins
  if (points.length < 2) return null;
  const xs = points.map((p) => (d(p.date) - d(points[0].date)) / WEEK_MS);
  const ys = points.map((p) => p.lbs);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  if (den === 0) return null;
  const slope = num / den;
  return { slope, at: (t) => my + slope * ((t - d(points[0].date)) / WEEK_MS - mx) };
}

// ---- svg helpers ------------------------------------------------------------

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmt1 = (n) => (Math.round(n * 10) / 10).toString();

const AXIS_TEXT = `font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="12" fill="var(--viz-muted)"`;

// ---- weight chart -----------------------------------------------------------

export function weightChart(weeks) {
  const pts = weighIns(weeks);
  const W = 720, H = 380, m = { t: 24, r: 76, b: 34, l: 44 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const t0 = d(PLAN.startDate), t1 = d(PLAN.endDate);
  const weeksTotal = (t1 - t0) / WEEK_MS;

  const bandFast = PLAN.startLbs - PLAN.rateHigh * weeksTotal;
  const reg = regression(pts.slice(-6));
  const projEnd = reg ? reg.at(t1) : null;
  const yVals = [PLAN.startLbs, bandFast, ...pts.map((p) => p.lbs)];
  if (projEnd !== null) yVals.push(projEnd);
  const yMin = Math.floor((Math.min(...yVals) - 4) / 5) * 5;
  const yMax = Math.ceil((Math.max(...yVals) + 4) / 5) * 5;

  const x = (t) => m.l + ((t - t0) / (t1 - t0)) * iw;
  const y = (v) => m.t + ((yMax - v) / (yMax - yMin)) * ih;

  let g = "";
  // horizontal gridlines + y ticks every 5 lb
  for (let v = yMin; v <= yMax; v += 5) {
    g += `<line x1="${m.l}" y1="${y(v)}" x2="${m.l + iw}" y2="${y(v)}" stroke="var(--viz-grid)" stroke-width="1"/>`;
    g += `<text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" ${AXIS_TEXT}>${v}</text>`;
  }
  // month ticks
  for (const [label, date] of [["Aug", "2026-08-10"], ["Sep", "2026-09-01"], ["Oct", "2026-10-01"], ["Nov", "2026-11-01"], ["Dec", "2026-12-01"]]) {
    g += `<text x="${x(d(date))}" y="${H - 10}" text-anchor="middle" ${AXIS_TEXT}>${label}</text>`;
  }
  // baseline axis
  g += `<line x1="${m.l}" y1="${m.t + ih}" x2="${m.l + iw}" y2="${m.t + ih}" stroke="var(--viz-axis)" stroke-width="1"/>`;

  // target corridor: 1.0–1.5 lb/week from the start weight
  const band = `M ${x(t0)} ${y(PLAN.startLbs)} L ${x(t1)} ${y(PLAN.startLbs - PLAN.rateLow * weeksTotal)} L ${x(t1)} ${y(bandFast)} Z`;
  g += `<path d="${band}" fill="var(--viz-series1)" opacity="0.09"/>`;
  g += `<text x="${x(t1) - 6}" y="${y((PLAN.startLbs - PLAN.rateLow * weeksTotal + bandFast) / 2) + 4}" text-anchor="end" ${AXIS_TEXT}>target zone</text>`;

  // projection (dashed, only with 2+ weigh-ins)
  if (reg && pts.length >= 2) {
    const last = pts[pts.length - 1];
    g += `<line x1="${x(d(last.date))}" y1="${y(last.lbs)}" x2="${x(t1)}" y2="${y(projEnd)}" stroke="var(--viz-series1)" stroke-width="2" stroke-dasharray="6 5" opacity="0.65"/>`;
    g += `<text x="${x(t1) + 8}" y="${y(projEnd) + 4}" ${AXIS_TEXT}>${fmt1(projEnd)} projected</text>`;
  }

  // actual line + markers (2px surface ring on each dot)
  if (pts.length > 1) {
    const path = pts.map((p, i) => `${i ? "L" : "M"} ${x(d(p.date)).toFixed(1)} ${y(p.lbs).toFixed(1)}`).join(" ");
    g += `<path d="${path}" fill="none" stroke="var(--viz-series1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  for (const p of pts) {
    g += `<circle cx="${x(d(p.date)).toFixed(1)}" cy="${y(p.lbs).toFixed(1)}" r="4.5" fill="var(--viz-series1)" stroke="var(--bg)" stroke-width="2"><title>${esc(p.date)}: ${fmt1(p.lbs)} lb</title></circle>`;
  }
  // direct label on the latest weigh-in only
  if (pts.length) {
    const p = pts[pts.length - 1];
    g += `<text x="${x(d(p.date))}" y="${y(p.lbs) - 12}" text-anchor="middle" font-weight="600" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="13" fill="var(--text)">${fmt1(p.lbs)} lb</text>`;
  }

  const legend = `
  <div class="viz-legend">
    <span><i class="key key-line"></i>Actual</span>
    ${pts.length >= 2 ? `<span><i class="key key-dash"></i>Projection</span>` : ""}
    <span><i class="key key-band"></i>Target zone (1–1.5 lb/wk)</span>
  </div>`;

  return `<div class="viz">${legend}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight over time against the target zone">${g}</svg></div>`;
}

// ---- adherence chart --------------------------------------------------------

export function adherenceChart(weeks) {
  const rows = [...weeks]
    .sort((a, b) => a.data.week - b.data.week)
    .map((w) => ({ week: w.data.week, ...adherence(w) }));
  if (!rows.length) return "";

  const W = 720, H = 260, m = { t: 26, r: 16, b: 32, l: 44 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const slots = Math.max(rows.length, 8); // keep early bars from looking huge
  const slot = iw / slots;
  const bw = Math.min(24, slot - 6);
  const y = (v) => m.t + ((100 - v) / 100) * ih;

  let g = "";
  for (const v of [0, 25, 50, 75, 100]) {
    g += `<line x1="${m.l}" y1="${y(v)}" x2="${m.l + iw}" y2="${y(v)}" stroke="var(--viz-grid)" stroke-width="1"/>`;
    g += `<text x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end" ${AXIS_TEXT}>${v}%</text>`;
  }
  rows.forEach((r, i) => {
    const cx = m.l + slot * i + slot / 2;
    const x0 = cx - bw / 2, y1 = y(r.pct), y0 = y(0);
    const rr = Math.min(4, (y0 - y1) / 2);
    const bar = r.pct === 0
      ? `<line x1="${x0}" y1="${y0}" x2="${x0 + bw}" y2="${y0}" stroke="var(--viz-series1)" stroke-width="2"/>`
      : `<path d="M ${x0} ${y0} L ${x0} ${y1 + rr} Q ${x0} ${y1} ${x0 + rr} ${y1} L ${x0 + bw - rr} ${y1} Q ${x0 + bw} ${y1} ${x0 + bw} ${y1 + rr} L ${x0 + bw} ${y0} Z" fill="var(--viz-series1)"><title>Week ${r.week}: ${r.done}/${r.total} done</title></path>`;
    g += bar;
    g += `<text x="${cx}" y="${y1 - 8}" text-anchor="middle" font-weight="600" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="12" fill="var(--text)">${r.pct}%</text>`;
    g += `<text x="${cx}" y="${H - 10}" text-anchor="middle" ${AXIS_TEXT}>W${r.week}</text>`;
  });
  g += `<line x1="${m.l}" y1="${y(0)}" x2="${m.l + iw}" y2="${y(0)}" stroke="var(--viz-axis)" stroke-width="1"/>`;

  return `<div class="viz"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Workouts completed per week, percent of checkboxes checked">${g}</svg></div>`;
}

// ---- stat tiles -------------------------------------------------------------

export function statTiles(weeks) {
  const pts = weighIns(weeks);
  const latest = pts[pts.length - 1];
  const reg = regression(pts.slice(-6));
  const projEnd = reg ? reg.at(d(PLAN.endDate)) : null;

  const tiles = [];
  const tile = (label, value, sub) =>
    tiles.push(`<div class="tile"><div class="tile-label">${label}</div><div class="tile-value">${value}</div>${sub ? `<div class="tile-sub">${sub}</div>` : ""}</div>`);

  if (latest) {
    const delta = latest.lbs - PLAN.startLbs;
    tile("Current weight", `${fmt1(latest.lbs)} lb`,
      delta < 0 ? `<span class="good">▼ ${fmt1(-delta)} lb</span> since start`
        : delta > 0 ? `▲ ${fmt1(delta)} lb since start` : "starting point logged");
  } else {
    tile("Current weight", "—", "log a weigh-in to begin");
  }

  tile("Weekly pace", reg ? `${fmt1(-reg.slope)} lb/wk` : "—",
    reg ? "recent trend" : "needs 2+ weigh-ins");

  tile("Projected Dec 31", projEnd !== null ? `${fmt1(projEnd)} lb` : "on plan: 225–230",
    projEnd !== null
      ? (projEnd <= PLAN.goalHigh ? `<span class="good">inside the goal</span>` : `goal is ${PLAN.goalLow}–${PLAN.goalHigh}`)
      : "at 1–1.5 lb/wk");

  const latestWeek = [...weeks].sort((a, b) => b.data.week - a.data.week)[0];
  if (latestWeek) {
    const a = adherence(latestWeek);
    tile(`Week ${latestWeek.data.week} adherence`, `${a.done}/${a.total}`, `${a.pct}% of checkboxes done`);
  }

  return `<div class="tiles">${tiles.join("")}</div>`;
}

// ---- table view (accessibility fallback for the charts) ---------------------

export function progressTable(weeks) {
  const pts = weighIns(weeks);
  const rows = [...weeks].sort((a, b) => a.data.week - b.data.week);
  let html = `<details class="viz-table"><summary>View the data as a table</summary><table>
  <tr><th>Week</th><th>Dates</th><th>Done</th><th>Weigh-ins</th></tr>`;
  for (const w of rows) {
    const a = adherence(w);
    const wis = pts.filter((p) => (w.data.weighIns || []).some((x) => String(x.date instanceof Date ? x.date.toISOString().slice(0, 10) : x.date) === p.date))
      .map((p) => `${p.date}: ${fmt1(p.lbs)} lb`).join("<br>") || "—";
    html += `<tr><td>Week ${w.data.week}</td><td>${esc(w.data.dateRange || "")}</td><td>${a.done}/${a.total} (${a.pct}%)</td><td>${wis}</td></tr>`;
  }
  return html + "</table></details>";
}
