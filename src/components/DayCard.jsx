import { useState } from "react";
import { MEALS, GROUPS, TARGET } from "../data/foods.js";
import { EXERCISES } from "../data/exercises.js";
import { doneId, isDone, mealKey, slotChoice, dayTotals } from "../lib/plan.js";
import { toggleDone, setChoice, resetChoice } from "../store.js";
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

const SLOT_LABELS = { m1: "Lunch · noon", m2: "Dinner · evening", m3: "Snack / top-up" };

function CustomLogForm({ onLog }) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  return (
    <form
      className="custom-form"
      onSubmit={(e) => {
        e.preventDefault();
        const k = parseFloat(kcal), p = parseFloat(protein) || 0;
        if (name.trim() && k >= 0) {
          onLog({ custom: true, name: name.trim(), kcal: k, protein: p });
          setName(""); setKcal(""); setProtein("");
        }
      }}
    >
      <input placeholder="What was it?" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="kcal" type="number" inputMode="numeric" min="0" value={kcal} onChange={(e) => setKcal(e.target.value)} />
      <input placeholder="protein g" type="number" inputMode="numeric" min="0" value={protein} onChange={(e) => setProtein(e.target.value)} />
      <button className="btn" type="submit">Log it</button>
    </form>
  );
}

function MealSlot({ week, day, slot, store }) {
  const [open, setOpen] = useState(false);
  const key = mealKey(week, day.key, slot);
  const chosen = slotChoice(week, day, slot, store.mealChoice);
  const swapped = store.mealChoice[key] !== undefined;
  const plannedId = day.meals[slot];
  const groupIds = Object.keys(MEALS).filter((id) => MEALS[id].group === GROUPS[slot]);
  const quickIds = Object.keys(MEALS).filter((id) => MEALS[id].group === "quick");

  const pick = (id) => {
    if (id === plannedId) resetChoice(key);
    else setChoice(key, id);
    setOpen(false);
  };

  return (
    <div className="meal">
      <div className="meal-head">
        <strong>{SLOT_LABELS[slot]}{swapped && <span className="edited-tag">swapped</span>}</strong>
        <span className="meal-macros">{Math.round(chosen.kcal)} kcal · {Math.round(chosen.protein)} g</span>
      </div>
      <div className="option">
        <span className="option-name">{chosen.name}</span>
        {chosen.desc && <span className="option-desc">{chosen.desc}</span>}
      </div>
      {chosen.how && <p className="how">{chosen.how}</p>}
      <div className="meal-actions">
        <button className="link-btn" onClick={() => setOpen(!open)}>{open ? "close" : "swap / log off-plan"}</button>
        {swapped && <button className="link-btn" onClick={() => { resetChoice(key); setOpen(false); }}>back to plan</button>}
      </div>
      {open && (
        <div className="picker">
          <div className="picker-cat">The {GROUPS[slot]} options</div>
          <div className="option-list">
            {groupIds.map((id) => (
              <button key={id} className={"option-btn" + (chosen.id === id ? " current" : "")} onClick={() => pick(id)}>
                <span className="food-name">{MEALS[id].name}{id === plannedId ? " · planned" : ""}</span>
                <span className="food-info">{MEALS[id].kcal} kcal · {MEALS[id].protein} g</span>
              </button>
            ))}
          </div>
          <div className="picker-cat">Life happened</div>
          <div className="option-list">
            {quickIds.map((id) => (
              <button key={id} className={"option-btn" + (chosen.id === id ? " current" : "")} onClick={() => pick(id)}>
                <span className="food-name">{MEALS[id].name}</span>
                <span className="food-info">{MEALS[id].kcal} kcal · {MEALS[id].protein} g</span>
              </button>
            ))}
          </div>
          <CustomLogForm onLog={(c) => { setChoice(key, c); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

export default function DayCard({ week, day, store, isToday }) {
  const t = dayTotals(week, day, store.mealChoice);
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
        <DoneButton week={week} day={day} slot="workout" localDone={store.done}>
          {day.workout.minutes === 0 ? "Rest day honored" : "Workout done"}
        </DoneButton>
      </section>

      {/* EAT */}
      <section className="card">
        <div className="card-tag">Eat</div>
        <h3>Fast until noon · window closes 8pm</h3>
        {["m1", "m2", "m3"].map((slot) => (
          <MealSlot key={slot} week={week} day={day} slot={slot} store={store} />
        ))}
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
          {day.shoppingDay && <Shopping week={week} store={store} />}
        </section>
      )}

      {/* HABITS */}
      <section className="card">
        <div className="card-tag">Every day</div>
        <p className="habits-line">Shower after sweating · clean clothes · {["mon", "wed", "fri"].includes(day.key) ? "BP wash today" : "no BP wash today"} · water all morning, black coffee & zero-cal drinks fine</p>
        <DoneButton week={week} day={day} slot="habits" localDone={store.done}>Habits done</DoneButton>
      </section>
    </div>
  );
}
