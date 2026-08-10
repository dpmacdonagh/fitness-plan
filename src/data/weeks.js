// The prescription. One entry per week; each day says exactly what to do,
// eat, prep, and buy. The coach (Claude) edits this file from what Dan
// reports: done flags, weigh-ins, notes, and next week's programming.
//
// Kitchen: Ninja Foodi Steam & Crisp (small). Dinners are cooked fresh in
// it with zero weeknight chopping. Lunches are packed Sunday/night-before
// and microwaved at work. Foodi instructions live on each dinner option
// in src/data/foods.js.

export const CORE_TRIO = [
  { ex: "curl-up", dose: "5/side" },
  { ex: "side-plank", dose: "10 s/side" },
  { ex: "bird-dog", dose: "5/side" },
];

const STRENGTH_A = [
  { ex: "incline-pushup", dose: "2×8" },
  { ex: "glute-bridge", dose: "2×10" },
  { ex: "chair-squat", dose: "2×8" },
];

// Meals are option ids from the set menu (src/data/foods.js):
// m1 lunch (L1 batch bowl / L2 wrap kit / L3 store-bought),
// m2 dinner (D1 thighs / D2 salmon / D3 shrimp tacos),
// m3 snack (S1 protein double / S2 stick pack / S3 bar+fruit).

export const WEEKS = [
  {
    week: 1,
    start: "2026-08-10", // Monday
    focus: "Bridge week: store-bought food only (keep days under ~2,000 kcal, grab protein where you can), cooking starts after Sunday's first prep. Boil protocol active: no friction cardio until it's calm AND the compression shorts arrive — strength and core carry the week.",
    weighIns: [{ date: "2026-08-10", lbs: 250 }],
    days: [
      {
        key: "mon", name: "Monday",
        workout: { title: "Walk + core trio", minutes: 25, items: [{ text: "20-min walk, easy pace" }, ...CORE_TRIO], after: "Shower right after." },
        meals: { m1: "L3", m2: "Q3", m3: "S1" },
        prep: ["Weigh in (morning, before coffee) and tell the coach.", "Store run for the week: check the Buy list on the Food tab."],
      },
      {
        key: "tue", name: "Tuesday",
        workout: { title: "Strength A", minutes: 15, items: STRENGTH_A, after: "Stop every set 3–4 reps short of failure." },
        meals: { m1: "L3", m2: "Q3", m3: "S1" },
        prep: [],
      },
      {
        key: "wed", name: "Wednesday",
        workout: { title: "Core trio + bridges (no friction)", minutes: 15, items: [...CORE_TRIO, { ex: "glute-bridge", dose: "2×12" }], after: "Nothing that rubs the boil. Warm compress on it tonight; keep it covered." },
        meals: { m1: "L3", m2: "Q3", m3: "S1" },
        prep: ["BP wash day (Mon/Wed/Fri)."],
      },
      {
        key: "thu", name: "Thursday",
        workout: { title: "Core trio + bridges (no friction)", minutes: 15, items: [...CORE_TRIO, { ex: "glute-bridge", dose: "2×12" }], after: "Cardio stays suspended until the boil is calm AND the compression shorts arrive. Boil check: better or worse than yesterday? Tell the coach." },
        meals: { m1: "L3", m2: "Q3", m3: "S1" },
        prep: [],
      },
      {
        key: "fri", name: "Friday",
        workout: { title: "Strength A (again)", minutes: 15, items: STRENGTH_A, after: "Core trio optional if you feel good." },
        meals: { m1: "L3", m2: "Q3", m3: "S1" },
        prep: ["BP wash day."],
      },
      {
        key: "sat", name: "Saturday",
        workout: { title: "Conditional: test walk or core", minutes: 15, items: [{ text: "ONLY if the boil is calm and the shorts arrived: 15-min gentle test walk, stop at the first hint of rubbing." }, { text: "Otherwise: core trio + 2×12 glute bridges. Protecting the skin IS the plan." }], after: "" },
        meals: { m1: "L3", m2: "Q3", m3: "S1" },
        prep: [],
      },
      {
        key: "sun", name: "Sunday",
        workout: { title: "Off", minutes: 0, items: [{ text: "Rest day. Shower anyway." }], after: "" },
        meals: { m1: "L3", m2: "L1", m3: "S1" },
        prep: [
          "THE SUNDAY HOUR (~60 min, feeds next week's lunches):",
          "1. Rice: 3 cups dry in a pot, ~25 min — start it first.",
          "2. Foodi round 1: seasoned chicken thighs, Steam Crisp 390°F / 18 min. Shred half into a bowl with a jar of salsa = salsa chicken.",
          "3. Foodi round 2 (while shredding): next tray of thighs or the week's marinated protein.",
          "4. Portion 5 lunch containers: salsa chicken + rice + black beans + cheese. Fridge holds 3–4 days — freeze Thursday/Friday's pair.",
          "5. Veg bins, 5 min: snap green beans into a bin. Broccoli and slaw come pre-cut — zero knife work.",
          "6. Restock the grab-and-go drawer: meat sticks, cheese sticks, bars, zero-cal drinks where you'll see them.",
        ],
        shoppingDay: true,
      },
    ],
    done: {},
    coachNotes: "Mon 8/10: boil on leg still angry after self-lancing; 5-min walk agitated it (compression shorts on order). Friction cardio suspended, strength/core substituted — rule 3 bends the plan, never breaks. Eating is store-bought under ~2k/day until the first Sunday prep on 8/16. Watch-fors given: spreading redness, streaks, fever = urgent care.",
  },
];

export const PLAN = {
  startDate: "2026-08-10",
  startLbs: 250,
  goalLow: 225,
  goalHigh: 230,
  endDate: "2026-12-31",
  rateLow: 1.0,
  rateHigh: 1.5,
};

export const MILESTONES = [
  { id: "site", label: "Day one: plan exists, app is live", done: true },
  { id: "fullweek", label: "First full week: every box checked", done: false },
  { id: "w245", label: "245 lb — the first five, momentum is real", done: false },
  { id: "elli3", label: "Elliptical 3× in one week", done: false },
  { id: "w240", label: "240 lb — double digits gone", done: false },
  { id: "bike", label: "October: convert to the stationary bike", done: false },
  { id: "w235", label: "235 lb", done: false },
  { id: "w230", label: "230 lb — inside the end-of-year goal band", done: false },
  { id: "w225", label: "225 lb — stretch goal", done: false },
];

// date helpers (local time)
export function dateKey(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
export function findToday(now) {
  for (const w of WEEKS) {
    const start = new Date(w.start + "T00:00:00");
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (dateKey(d) === dateKey(now)) return { week: w, dayIndex: i, date: d, current: true };
    }
  }
  const w = WEEKS[WEEKS.length - 1];
  const dayIndex = (now.getDay() + 6) % 7; // Mon=0
  return { week: w, dayIndex, date: now, current: false };
}
