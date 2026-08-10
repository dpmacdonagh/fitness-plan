import { useState } from "react";
import { getFood, CATS, FOODS, TARGET, mealTotals, dayMealTotals } from "../data/foods.js";
import { EXERCISES } from "../data/exercises.js";
import { doneId, isDone, mealId, effectiveMeal, effectiveMeals } from "../lib/plan.js";
import { toggleDone, setMeal, resetMeal, addCustomFood } from "../store.js";
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

function CustomFoodForm({ onAdd }) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  return (
    <form
      className="custom-form"
      onSubmit={(e) => {
        e.preventDefault();
        const k = parseFloat(kcal), p = parseFloat(protein);
        if (name.trim() && k >= 0 && p >= 0) {
          onAdd(name.trim(), k, p || 0);
          setName(""); setKcal(""); setProtein("");
        }
      }}
    >
      <input placeholder="Food name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="kcal" type="number" inputMode="numeric" min="0" value={kcal} onChange={(e) => setKcal(e.target.value)} />
      <input placeholder="protein g" type="number" inputMode="numeric" min="0" value={protein} onChange={(e) => setProtein(e.target.value)} />
      <button className="btn" type="submit">Add</button>
    </form>
  );
}

const SLOT_LABELS = {
  m1: "Lunch · noon",
  m2: "Dinner · evening",
  m3: "Snacks / top-up",
};

function MealEditor({ week, day, slot, store }) {
  const [open, setOpen] = useState(false);
  const id = mealId(week, day.key, slot);
  const items = effectiveMeal(week, day, slot, store.mealEdits);
  const edited = store.mealEdits[id] !== undefined;
  const t = mealTotals(items, store.customFoods);
  const how = day.how && day.how[slot];

  const change = (next) => setMeal(id, next);
  const removeOne = (idx) => {
    const next = items.map((x) => ({ ...x }));
    next[idx].q -= 1;
    change(next.filter((x) => x.q > 0));
  };
  const add = (foodId) => {
    const next = items.map((x) => ({ ...x }));
    const ex = next.find((x) => x.id === foodId);
    if (ex) ex.q += 1; else next.push({ id: foodId, q: 1 });
    change(next);
  };

  return (
    <div className="meal">
      <div className="meal-head">
        <strong>{SLOT_LABELS[slot]}{edited && <span className="edited-tag">edited</span>}</strong>
        <span className="meal-macros">{Math.round(t.kcal)} kcal · {Math.round(t.protein)} g</span>
      </div>
      {how && <p className="how">{how}</p>}
      <ul className="meal-items">
        {items.map((it, i) => {
          const f = getFood(it.id, store.customFoods);
          if (!f) return null;
          return (
            <li key={i}>
              <span>{f.name}{it.q > 1 ? ` ×${it.q}` : ""} <span className="serv">({f.serving})</span></span>
              <button className="item-x" aria-label={`Remove one ${f.name}`} onClick={() => removeOne(i)}>−</button>
            </li>
          );
        })}
      </ul>
      <div className="meal-actions">
        <button className="link-btn" onClick={() => setOpen(!open)}>{open ? "close" : "+ add / edit"}</button>
        {edited && <button className="link-btn" onClick={() => resetMeal(id)}>reset to plan</button>}
      </div>
      {open && (
        <div className="picker">
          {CATS.map(([cat, label]) => (
            <div key={cat}>
              <div className="picker-cat">{label}</div>
              <div className="picker-grid">
                {Object.keys(FOODS).filter((fid) => FOODS[fid].cat === cat).map((fid) => (
                  <button key={fid} className="food-btn" onClick={() => add(fid)}>
                    <span className="food-name">{FOODS[fid].name}</span>
                    <span className="food-info">{FOODS[fid].serving} · {FOODS[fid].kcal} kcal · {FOODS[fid].protein} g</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="picker-cat">My foods</div>
          <div className="picker-grid">
            {Object.keys(store.customFoods).map((fid) => (
              <button key={fid} className="food-btn" onClick={() => add(fid)}>
                <span className="food-name">{store.customFoods[fid].name}</span>
                <span className="food-info">{store.customFoods[fid].kcal} kcal · {store.customFoods[fid].protein} g</span>
              </button>
            ))}
          </div>
          <CustomFoodForm onAdd={(name, kcal, protein) => add(addCustomFood(name, kcal, protein))} />
        </div>
      )}
    </div>
  );
}

export default function DayCard({ week, day, store, isToday }) {
  const meals = effectiveMeals(week, day, store.mealEdits);
  const t = dayMealTotals(meals, store.customFoods);
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
          <MealEditor key={slot} week={week} day={day} slot={slot} store={store} />
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
