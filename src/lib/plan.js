import { MEALS, INGREDIENTS, choiceInfo } from "../data/foods.js";

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

export function mealKey(week, dayKey, slot) {
  return `w${week.week}:${dayKey}:${slot}`;
}

// What's actually chosen for a slot: device choice if set, else the plan.
export function slotChoice(week, day, slot, mealChoice) {
  return choiceInfo(mealChoice[mealKey(week, day.key, slot)] || null, day.meals[slot]);
}

export function dayTotals(week, day, mealChoice) {
  let kcal = 0, protein = 0;
  for (const slot of ["m1", "m2", "m3"]) {
    const c = slotChoice(week, day, slot, mealChoice);
    kcal += c.kcal || 0;
    protein += c.protein || 0;
  }
  return { kcal, protein };
}

// Shopping: sum each scheduled (or swapped-to) option's ingredient list.
export function weekNeeds(week, mealChoice) {
  const need = {};
  for (const day of week.days) {
    for (const slot of ["m1", "m2", "m3"]) {
      const c = slotChoice(week, day, slot, mealChoice || {});
      const meal = c.id && MEALS[c.id];
      if (!meal) continue;
      for (const [ing, q] of meal.shop) need[ing] = (need[ing] || 0) + q;
    }
  }
  return need;
}

export function shoppingRows(week, pantry, mealChoice) {
  const need = weekNeeds(week, mealChoice);
  const rows = [];
  for (const id of Object.keys(need)) {
    const have = pantry[id] || 0;
    const remaining = need[id] - have;
    if (remaining > 0 && INGREDIENTS[id]) {
      rows.push({ id, packs: Math.ceil(remaining / INGREDIENTS[id].perPack), need: Math.ceil(need[id]), have });
    }
  }
  rows.sort((a, b) => (INGREDIENTS[a.id].name < INGREDIENTS[b.id].name ? -1 : 1));
  return rows;
}
