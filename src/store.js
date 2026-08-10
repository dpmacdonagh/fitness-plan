// Device-local state (localStorage): checkmarks, weigh-ins logged in-app,
// pantry, shopping checks. The coach's canonical record lives in
// src/data/weeks.js; the app merges the two (either says done -> done).
import { useSyncExternalStore } from "react";

const KEY = "fitcoach-v2";

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && typeof s === "object") return { done: {}, weights: [], pantry: {}, shopChecked: {}, ...s };
  } catch (e) { /* fresh */ }
  return { done: {}, weights: [], pantry: {}, shopChecked: {} };
}

let state = load();
const listeners = new Set();

export function getState() { return state; }

export function update(fn) {
  state = { ...state, ...fn(state) };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

// helpers
export function toggleDone(id) {
  update((s) => ({ done: { ...s.done, [id]: !s.done[id] } }));
}
export function addWeight(lbs, date) {
  update((s) => ({
    weights: [...s.weights.filter((w) => w.date !== date), { date, lbs }].sort((a, b) => (a.date < b.date ? -1 : 1)),
  }));
}
export function setPantry(id, n) {
  update((s) => ({ pantry: { ...s.pantry, [id]: Math.max(0, n) } }));
}
export function setShopChecked(id, v) {
  update((s) => ({ shopChecked: { ...s.shopChecked, [id]: v } }));
}
