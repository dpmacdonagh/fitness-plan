// App state: localStorage is the on-device cache; when a sync token is set,
// state also lives in data/state.json on the repo's `app-state` branch so
// every device (and the coach) sees the same thing.
import { useSyncExternalStore } from "react";
import { pickSynced, mergeDocs, fetchRemote, pushRemote } from "./sync.js";

const KEY = "fitcoach-v2";
const TOKEN_KEY = "fitcoach-token";

const EMPTY = {
  done: {}, weights: [], pantry: {}, shopChecked: {}, mealEdits: {}, customFoods: {},
  updatedAt: 0,
  sync: { status: "off", detail: "" }, // device-only, never uploaded
};

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && typeof s === "object") return { ...EMPTY, ...s, sync: { ...EMPTY.sync } };
  } catch (e) { /* fresh */ }
  return { ...EMPTY };
}

let state = load();
const listeners = new Set();

function persistLocal() {
  try {
    const { sync, ...rest } = state;
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch (e) { /* private mode */ }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getState() { return state; }

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) { /* ignore */ }
  state = { ...state, sync: { status: token ? "idle" : "off", detail: "" } };
  emit();
  if (token) { schedulePush(); }
}

function setSync(status, detail = "") {
  state = { ...state, sync: { status, detail } };
  emit();
}

// ---- debounced push ----
let pushTimer = null;
function schedulePush() {
  const token = getToken();
  if (!token) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(doPush, 2000);
}

async function doPush() {
  const token = getToken();
  if (!token) return;
  setSync("syncing");
  try {
    const res = await pushRemote(token, pickSynced(state));
    if (res.conflict) {
      // someone else wrote first: pull, merge, push once more
      const remote = await fetchRemote();
      state = { ...state, ...mergeDocs(pickSynced(state), remote) };
      persistLocal();
      emit();
      await pushRemote(token, pickSynced(state));
    }
    setSync("ok", new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
  } catch (e) {
    setSync("error", String(e.message || e));
  }
}

// ---- startup pull (runs regardless of token; reads are public) ----
export async function initSync() {
  const remote = await fetchRemote();
  if (remote) {
    state = { ...state, ...mergeDocs(pickSynced(state), remote) };
    persistLocal();
    emit();
    if (getToken()) setSync("ok", "pulled latest");
  } else if (getToken()) {
    setSync("idle");
  }
}

export function update(fn) {
  state = { ...state, ...fn(state), updatedAt: Date.now() };
  persistLocal();
  emit();
  schedulePush();
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore() {
  return useSyncExternalStore(subscribe, getState, getState);
}

// ---- helpers ----
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
// Meal overrides: once a meal is edited, the full item list is owned by state.
export function setMeal(mealId, items) {
  update((s) => ({ mealEdits: { ...s.mealEdits, [mealId]: items } }));
}
export function resetMeal(mealId) {
  update((s) => {
    const mealEdits = { ...s.mealEdits };
    delete mealEdits[mealId];
    return { mealEdits };
  });
}
export function addCustomFood(name, kcal, protein) {
  const id = "cf-" + Date.now().toString(36);
  update((s) => ({ customFoods: { ...s.customFoods, [id]: { name, kcal, protein } } }));
  return id;
}
