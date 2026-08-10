import { useState } from "react";
import { WEEKS, PLAN, MILESTONES, dateKey } from "../data/weeks.js";
import { weekAdherence } from "../lib/plan.js";
import { WeightChart, AdherenceChart, mergedWeighIns } from "../components/Charts.jsx";
import { addWeight } from "../store.js";

export default function ProgressScreen({ store }) {
  const pts = mergedWeighIns(store.weights);
  const latest = pts[pts.length - 1];
  const [lbs, setLbs] = useState("");
  const rows = WEEKS.map((w) => ({ week: w.week, ...weekAdherence(w, store.done) }));

  let pace = null;
  if (pts.length >= 2) {
    const a = pts[Math.max(0, pts.length - 5)], b = pts[pts.length - 1];
    const weeks = (new Date(b.date) - new Date(a.date)) / (7 * 24 * 3600 * 1000);
    if (weeks > 0) pace = (a.lbs - b.lbs) / weeks;
  }

  return (
    <>
      <section className="card">
        <div className="card-tag">Log a weigh-in</div>
        <p className="note">Morning, after the bathroom, before coffee. Saved on this device — tell your coach too, so it lands in the permanent record.</p>
        <form
          className="weigh-form"
          onSubmit={(e) => {
            e.preventDefault();
            const n = parseFloat(lbs);
            if (n > 100 && n < 500) {
              addWeight(n, dateKey(new Date()));
              setLbs("");
            }
          }}
        >
          <input type="number" inputMode="decimal" step="0.1" min="100" max="500" placeholder="lbs" value={lbs} onChange={(e) => setLbs(e.target.value)} />
          <button className="btn" type="submit">Log today</button>
        </form>
      </section>

      <div className="tiles">
        <div className="tile">
          <div className="tile-label">Current weight</div>
          <div className="tile-value">{latest ? `${latest.lbs} lb` : "—"}</div>
          <div className="tile-sub">
            {latest && latest.lbs < PLAN.startLbs
              ? <span className="good">▼ {Math.round((PLAN.startLbs - latest.lbs) * 10) / 10} lb since start</span>
              : "starting point logged"}
          </div>
        </div>
        <div className="tile">
          <div className="tile-label">Weekly pace</div>
          <div className="tile-value">{pace !== null ? `${Math.round(pace * 10) / 10} lb/wk` : "—"}</div>
          <div className="tile-sub">{pace !== null ? "recent trend (target 1–1.5)" : "needs 2+ weigh-ins"}</div>
        </div>
        <div className="tile">
          <div className="tile-label">Goal</div>
          <div className="tile-value">{PLAN.goalLow}–{PLAN.goalHigh}</div>
          <div className="tile-sub">by Dec 31 at 1–1.5 lb/wk</div>
        </div>
        <div className="tile">
          <div className="tile-label">This week</div>
          <div className="tile-value">{rows[rows.length - 1].done}/{rows[rows.length - 1].total}</div>
          <div className="tile-sub">workout + habit boxes</div>
        </div>
      </div>

      <h2>Weight</h2>
      <p className="note">Stay anywhere inside the shaded corridor and the year is won.</p>
      <WeightChart localWeights={store.weights} />

      <h2>Consistency</h2>
      <p className="note">This chart matters more than the weight — the weight follows the checkmarks.</p>
      <AdherenceChart rows={rows} />

      <h2>Milestones</h2>
      <ul className="milestones">
        {MILESTONES.map((mi) => (
          <li key={mi.id} className={mi.done ? "hit" : ""}>
            <span className="mi-mark">{mi.done ? "✓" : "○"}</span> {mi.label}
          </li>
        ))}
      </ul>
    </>
  );
}
