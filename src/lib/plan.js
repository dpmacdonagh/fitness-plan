import { FOODS } from "../data/foods.js";

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

export function weekNeeds(week) {
  const need = {};
  for (const day of week.days) {
    for (const slot of ["m1", "m2", "m3"]) {
      for (const it of day.meals[slot] || []) need[it.id] = (need[it.id] || 0) + it.q;
    }
  }
  return need;
}

export function shoppingRows(week, pantry) {
  const need = weekNeeds(week);
  const rows = [];
  for (const id of Object.keys(need)) {
    const have = pantry[id] || 0;
    const remaining = need[id] - have;
    if (remaining > 0) {
      const f = FOODS[id];
      rows.push({ id, packs: Math.ceil(remaining / f.perPack), need: need[id], have });
    }
  }
  rows.sort((a, b) => (FOODS[a.id].name < FOODS[b.id].name ? -1 : 1));
  return rows;
}
