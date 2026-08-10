import { getFood } from "../data/foods.js";

// A day's tickable boxes. Adherence counts workout + habits (14/week);
// meals are guidance, not homework.
export function doneId(week, dayKey, slot) {
  return `w${week.week}:${dayKey}:${slot}`;
}

export function isDone(week, dayKey, slot, localDone) {
  const coach = (week.done && week.done[dayKey] && week.done[dayKey][slot]) || false;
  return coach || !!localDone[doneId(week, dayKey, slot)];
}

export function weekAdherence(week, localDone) {
  let done = 0, total = 0;
  for (const day of week.days) {
    for (const slot of ["workout", "habits"]) {
      total += 1;
      if (isDone(week, day.key, slot, localDone)) done += 1;
    }
  }
  return { done, total, pct: total ? Math.round((100 * done) / total) : 0 };
}

// Meal ids for device-local edits
export function mealId(week, dayKey, slot) {
  return `w${week.week}:${dayKey}:${slot}`;
}

// The meal actually in effect: device override if present, else prescription.
export function effectiveMeal(week, day, slot, mealEdits) {
  const override = mealEdits[mealId(week, day.key, slot)];
  return override !== undefined ? override : day.meals[slot] || [];
}

export function effectiveMeals(week, day, mealEdits) {
  return {
    m1: effectiveMeal(week, day, "m1", mealEdits),
    m2: effectiveMeal(week, day, "m2", mealEdits),
    m3: effectiveMeal(week, day, "m3", mealEdits),
  };
}

export function weekNeeds(week, mealEdits) {
  const need = {};
  for (const day of week.days) {
    const meals = effectiveMeals(week, day, mealEdits || {});
    for (const slot of ["m1", "m2", "m3"]) {
      for (const it of meals[slot]) need[it.id] = (need[it.id] || 0) + it.q;
    }
  }
  return need;
}

export function shoppingRows(week, pantry, mealEdits, customFoods) {
  const need = weekNeeds(week, mealEdits);
  const rows = [];
  for (const id of Object.keys(need)) {
    const have = pantry[id] || 0;
    const remaining = need[id] - have;
    const f = getFood(id, customFoods);
    if (remaining > 0 && f) {
      rows.push({ id, packs: Math.ceil(remaining / f.perPack), need: need[id], have });
    }
  }
  rows.sort((a, b) => (getFood(a.id, customFoods).name < getFood(b.id, customFoods).name ? -1 : 1));
  return rows;
}
