// Weight + adherence charts as inline SVG, themed via CSS variables.
import { WEEKS, PLAN } from "../data/weeks.js";

const WEEK_MS = 7 * 24 * 3600 * 1000;
const dms = (s) => new Date(s + "T00:00:00").getTime();

export function mergedWeighIns(localWeights) {
  const all = {};
  for (const w of WEEKS) for (const wi of w.weighIns || []) all[wi.date] = wi.lbs;
  for (const wi of localWeights || []) all[wi.date] = wi.lbs; // device entries win
  return Object.keys(all).sort().map((date) => ({ date, lbs: all[date] }));
}

function regression(points) {
  if (points.length < 2) return null;
  const xs = points.map((p) => (dms(p.date) - dms(points[0].date)) / WEEK_MS);
  const ys = points.map((p) => p.lbs);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  if (!den) return null;
  const slope = num / den;
  return { slope, at: (t) => my + slope * ((t - dms(points[0].date)) / WEEK_MS - mx) };
}

const AXIS = { fontSize: 12, fill: "var(--muted)", fontFamily: "inherit" };

export function WeightChart({ localWeights }) {
  const pts = mergedWeighIns(localWeights);
  const W = 720, H = 360, m = { t: 24, r: 80, b: 32, l: 44 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const t0 = dms(PLAN.startDate), t1 = dms(PLAN.endDate);
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

  const grid = [];
  for (let v = yMin; v <= yMax; v += 5) grid.push(v);
  const months = [["Aug", "2026-08-10"], ["Sep", "2026-09-01"], ["Oct", "2026-10-01"], ["Nov", "2026-11-01"], ["Dec", "2026-12-01"]];
  const last = pts[pts.length - 1];

  return (
    <div className="viz">
      <div className="viz-legend">
        <span><i className="key key-line" />Actual</span>
        {pts.length >= 2 && <span><i className="key key-dash" />Projection</span>}
        <span><i className="key key-band" />Target zone (1–1.5 lb/wk)</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Weight over time against the target zone">
        {grid.map((v) => (
          <g key={v}>
            <line x1={m.l} y1={y(v)} x2={m.l + iw} y2={y(v)} stroke="var(--grid)" strokeWidth="1" />
            <text x={m.l - 8} y={y(v) + 4} textAnchor="end" style={AXIS}>{v}</text>
          </g>
        ))}
        {months.map(([lab, d]) => (
          <text key={lab} x={x(dms(d))} y={H - 8} textAnchor="middle" style={AXIS}>{lab}</text>
        ))}
        <line x1={m.l} y1={m.t + ih} x2={m.l + iw} y2={m.t + ih} stroke="var(--axis)" strokeWidth="1" />
        <path
          d={`M ${x(t0)} ${y(PLAN.startLbs)} L ${x(t1)} ${y(PLAN.startLbs - PLAN.rateLow * weeksTotal)} L ${x(t1)} ${y(bandFast)} Z`}
          fill="var(--series)" opacity="0.09"
        />
        {reg && pts.length >= 2 && (
          <>
            <line x1={x(dms(last.date))} y1={y(last.lbs)} x2={x(t1)} y2={y(projEnd)}
              stroke="var(--series)" strokeWidth="2" strokeDasharray="6 5" opacity="0.65" />
            <text x={x(t1) + 6} y={y(projEnd) + 4} style={AXIS}>{Math.round(projEnd * 10) / 10} proj.</text>
          </>
        )}
        {pts.length > 1 && (
          <path
            d={pts.map((p, i) => `${i ? "L" : "M"} ${x(dms(p.date)).toFixed(1)} ${y(p.lbs).toFixed(1)}`).join(" ")}
            fill="none" stroke="var(--series)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
          />
        )}
        {pts.map((p) => (
          <circle key={p.date} cx={x(dms(p.date))} cy={y(p.lbs)} r="4.5" fill="var(--series)" stroke="var(--bg)" strokeWidth="2">
            <title>{p.date}: {p.lbs} lb</title>
          </circle>
        ))}
        {last && (
          <text x={x(dms(last.date))} y={y(last.lbs) - 12} textAnchor="middle" style={{ ...AXIS, fill: "var(--text)", fontWeight: 600, fontSize: 13 }}>
            {last.lbs} lb
          </text>
        )}
      </svg>
    </div>
  );
}

export function AdherenceChart({ rows }) {
  // rows: [{week, done, total, pct}]
  if (!rows.length) return null;
  const W = 720, H = 240, m = { t: 26, r: 16, b: 30, l: 44 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const slots = Math.max(rows.length, 8);
  const slot = iw / slots;
  const bw = Math.min(24, slot - 6);
  const y = (v) => m.t + ((100 - v) / 100) * ih;

  return (
    <div className="viz">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Percent of each week's plan completed">
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={m.l} y1={y(v)} x2={m.l + iw} y2={y(v)} stroke="var(--grid)" strokeWidth="1" />
            <text x={m.l - 8} y={y(v) + 4} textAnchor="end" style={AXIS}>{v}%</text>
          </g>
        ))}
        {rows.map((r, i) => {
          const cx = m.l + slot * i + slot / 2;
          const x0 = cx - bw / 2, y1 = y(r.pct), y0 = y(0);
          const rr = Math.min(4, (y0 - y1) / 2);
          return (
            <g key={r.week}>
              {r.pct === 0 ? (
                <line x1={x0} y1={y0} x2={x0 + bw} y2={y0} stroke="var(--series)" strokeWidth="2" />
              ) : (
                <path
                  d={`M ${x0} ${y0} L ${x0} ${y1 + rr} Q ${x0} ${y1} ${x0 + rr} ${y1} L ${x0 + bw - rr} ${y1} Q ${x0 + bw} ${y1} ${x0 + bw} ${y1 + rr} L ${x0 + bw} ${y0} Z`}
                  fill="var(--series)"
                >
                  <title>Week {r.week}: {r.done}/{r.total} done</title>
                </path>
              )}
              <text x={cx} y={y1 - 8} textAnchor="middle" style={{ ...AXIS, fill: "var(--text)", fontWeight: 600 }}>{r.pct}%</text>
              <text x={cx} y={H - 8} textAnchor="middle" style={AXIS}>W{r.week}</text>
            </g>
          );
        })}
        <line x1={m.l} y1={y(0)} x2={m.l + iw} y2={y(0)} stroke="var(--axis)" strokeWidth="1" />
      </svg>
    </div>
  );
}
