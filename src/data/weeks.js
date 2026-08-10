// The prescription. One entry per week; each day says exactly what to do,
// eat, prep, and buy. The coach (Claude) edits this file from what Dan
// reports: done flags, weigh-ins, notes, and next week's programming.

// Workout item shapes:
//  { ex: "<exercise id>", dose: "2×8" }  -> links to the demo library
//  { text: "20-min walk" }               -> plain instruction
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

// Meals reference the food db: { id, q }
const MEAL_BOWL = [{ id: "salsachx", q: 1 }, { id: "rice", q: 1 }, { id: "tortilla", q: 2 }, { id: "cheese", q: 1 }, { id: "salsa", q: 1 }];
const MEAL_ROTI = [{ id: "roti", q: 1 }, { id: "bakedpot", q: 1 }, { id: "steamveg", q: 1 }, { id: "fruit", q: 1 }, { id: "pb", q: 1 }];
const MEAL_TACO = [{ id: "beef", q: 1 }, { id: "tortilla", q: 2 }, { id: "cheese", q: 1 }, { id: "salsa", q: 1 }, { id: "saladkit", q: 1 }];
const MEAL_BREAKFAST_AT_NOON = [{ id: "eggs", q: 1 }, { id: "sausage", q: 1 }, { id: "bread", q: 1 }, { id: "fruit", q: 1 }];
const MEAL_TUNA_MELT = [{ id: "tuna", q: 2 }, { id: "bread", q: 1 }, { id: "cheese", q: 1 }, { id: "saladkit", q: 1 }];
const MEAL_LOADED_POTATO = [{ id: "roti", q: 1 }, { id: "bakedpot", q: 1 }, { id: "cheese", q: 1 }, { id: "steamveg", q: 1 }];
const TOPUP = [{ id: "yogurt", q: 1 }, { id: "shake", q: 1 }];
const TOPUP_BAR = [{ id: "bar", q: 1 }, { id: "yogurt", q: 1 }];

export const WEEKS = [
  {
    week: 1,
    start: "2026-08-10", // Monday
    focus: "Week one. The only goal is checkmarks — every session is deliberately easy.",
    weighIns: [{ date: "2026-08-10", lbs: 250 }],
    days: [
      {
        key: "mon", name: "Monday",
        workout: { title: "Walk + core trio", minutes: 25, items: [{ text: "20-min walk, easy pace" }, ...CORE_TRIO], after: "Shower right after." },
        meals: { m1: MEAL_BOWL, m2: MEAL_ROTI, m3: TOPUP },
        prep: ["Weigh in (morning, before coffee) and tell the coach."],
      },
      {
        key: "tue", name: "Tuesday",
        workout: { title: "Strength A", minutes: 15, items: STRENGTH_A, after: "Stop every set 3–4 reps short of failure." },
        meals: { m1: MEAL_TACO, m2: MEAL_LOADED_POTATO, m3: TOPUP },
        prep: [],
      },
      {
        key: "wed", name: "Wednesday",
        workout: { title: "Walk + core trio", minutes: 25, items: [{ text: "20-min walk, easy pace" }, ...CORE_TRIO], after: "Boil check tonight: calm = elliptical tomorrow, angry = walk instead." },
        meals: { m1: MEAL_BREAKFAST_AT_NOON, m2: MEAL_BOWL, m3: TOPUP_BAR },
        prep: ["BP wash day (Mon/Wed/Fri)."],
      },
      {
        key: "thu", name: "Thursday",
        workout: { title: "Elliptical (or walk)", minutes: 20, items: [{ text: "Elliptical 20 min, conversational pace" }, { text: "Fallback if the boil is angry: 25-min walk" }], after: "Compression shorts + anti-chafe balm. Shower immediately after." },
        meals: { m1: MEAL_TUNA_MELT, m2: MEAL_TACO, m3: TOPUP },
        prep: [],
      },
      {
        key: "fri", name: "Friday",
        workout: { title: "Strength A (again)", minutes: 15, items: STRENGTH_A, after: "Core trio optional if you feel good." },
        meals: { m1: MEAL_BOWL, m2: MEAL_ROTI, m3: TOPUP },
        prep: ["BP wash day."],
      },
      {
        key: "sat", name: "Saturday",
        workout: { title: "Walk somewhere new", minutes: 30, items: [{ text: "30-min walk: trailhead, park, river path. The get-out-of-the-car rep." }], after: "" },
        meals: { m1: MEAL_BREAKFAST_AT_NOON, m2: MEAL_LOADED_POTATO, m3: TOPUP_BAR },
        prep: [],
      },
      {
        key: "sun", name: "Sunday",
        workout: { title: "Off", minutes: 0, items: [{ text: "Rest day. Shower anyway." }], after: "" },
        meals: { m1: MEAL_TUNA_MELT, m2: MEAL_TACO, m3: TOPUP },
        prep: [
          "Shopping day — the Buy list below is this week's plan minus your pantry.",
          "30-min batch: slow-cooker salsa chicken (4–5 lb thighs + a jar of salsa, 6 h, shred). Brown 2 lb taco beef, 8 min.",
          "Portion into containers: fridge 3–4 days, freezer ~2 months.",
        ],
        shoppingDay: true,
      },
    ],
    // Coach-confirmed completion (Dan reports, coach records here — this is
    // what the adherence chart trusts; local taps in the app merge in on-device).
    done: {},
    coachNotes: "",
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
  // outside every programmed week: pin to the latest week's matching weekday
  const w = WEEKS[WEEKS.length - 1];
  const dayIndex = (now.getDay() + 6) % 7; // Mon=0
  return { week: w, dayIndex, date: now, current: false };
}
