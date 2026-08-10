import { useState } from "react";
import { FOODS, TARGET, mealTotals, dayMealTotals } from "../data/foods.js";
import { EXERCISES } from "../data/exercises.js";
import { doneId, isDone } from "../lib/plan.js";
import { toggleDone } from "../store.js";
import Rig from "./Rig.jsx";
import Meter from "./Meter.jsx";
import Shopping from "./Shopping.jsx";

function DoneButton({ week, day, slot, localDone, children }) {
  const done = isDone(week, day.key, slot, localDone);
  return (
    <button className={"done-btn" + (done ? " done" : "")} onClick={() => toggleDone(doneId(week, day.key, slot))}>
      <span className="done-mark">{done ? "✓" : ""}</span>
      {children}
    </button>
  );
}

function WorkoutItem({ item }) {
  const [open, setOpen] = useState(false);
  if (item.text) return <li className="wo-item">{item.text}</li>;
  const ex = EXERCISES[item.ex];
  return (
    <li className="wo-item">
      <button className="wo-ex" onClick={() => setOpen(!open)}>
        {ex.name} — <strong>{item.dose}</strong> <span className="wo-demo-hint">{open ? "hide demo" : "show demo"}</span>
      </button>
      {open && (
        <div className="wo-demo">
          <Rig id={item.ex} />
          <ul className="cues">{ex.cues.map((c, i) => <li key={i}>{c}</li>)}</ul>
          {ex.caution && <p className="caution">{ex.caution}</p>}
        </div>
      )}
    </li>
  );
}

const SLOT_LABELS = { m1: "Meal 1 · noon", m2: "Meal 2 · evening", m3: "Top-up · before 8pm" };

export default function DayCard({ week, day, localDone, pantry, shopChecked, isToday }) {
  const t = dayMealTotals(day.meals);
  const kcalOk = t.kcal >= TARGET.kcalLow && t.kcal <= TARGET.kcalHigh;
  const pOk = t.protein >= TARGET.pLow;
  return (
    <div className={"day-card" + (isToday ? " today" : "")}>
      {/* DO */}
      <section className="card">
        <div className="card-tag">Do</div>
        <h3>{day.workout.title}{day.workout.minutes ? ` · ~${day.workout.minutes} min` : ""}</h3>
        <ul className="wo-list">
          {day.workout.items.map((item, i) => <WorkoutItem key={i} item={item} />)}
        </ul>
        {day.workout.after && <p className="after">{day.workout.after}</p>}
        {day.workout.minutes > 0 || day.workout.items.length ? (
          <DoneButton week={week} day={day} slot="workout" localDone={localDone}>
            {day.workout.minutes === 0 ? "Rest day honored" : "Workout done"}
          </DoneButton>
        ) : null}
      </section>

      {/* EAT */}
      <section className="card">
        <div className="card-tag">Eat</div>
        <h3>Fast until noon · window closes 8pm</h3>
        {["m1", "m2", "m3"].map((slot) => {
          const items = day.meals[slot] || [];
          const mt = mealTotals(items);
          return (
            <div key={slot} className="meal">
              <div className="meal-head">
                <strong>{SLOT_LABELS[slot]}</strong>
                <span className="meal-macros">{Math.round(mt.kcal)} kcal · {Math.round(mt.protein)} g</span>
              </div>
              <ul className="meal-items">
                {items.map((it, i) => {
                  const f = FOODS[it.id];
                  return <li key={i}>{f.name}{it.q > 1 ? ` ×${it.q}` : ""} <span className="serv">({f.serving})</span></li>;
                })}
              </ul>
            </div>
          );
        })}
        <Meter label={`Day total (target ${TARGET.kcalLow}–${TARGET.kcalHigh})`} value={t.kcal} unit="kcal" lo={TARGET.kcalLow} hi={TARGET.kcalHigh} max={3000} good={kcalOk} />
        <Meter label={`Protein (target ${TARGET.pLow}–${TARGET.pHigh})`} value={t.protein} unit="g" lo={TARGET.pLow} hi={TARGET.pHigh} max={220} good={pOk} />
      </section>

      {/* PREP / BUY */}
      {(day.prep.length > 0 || day.shoppingDay) && (
        <section className="card">
          <div className="card-tag">{day.shoppingDay ? "Buy & prep" : "Prep"}</div>
          <ul className="prep-list">
            {day.prep.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          {day.shoppingDay && <Shopping week={week} pantry={pantry} shopChecked={shopChecked} />}
        </section>
      )}

      {/* HABITS */}
      <section className="card">
        <div className="card-tag">Every day</div>
        <p className="habits-line">Shower after sweating · clean clothes · {["mon", "wed", "fri"].includes(day.key) ? "BP wash today" : "no BP wash today"} · water all morning, black coffee is fine</p>
        <DoneButton week={week} day={day} slot="habits" localDone={localDone}>Habits done</DoneButton>
      </section>
    </div>
  );
}
