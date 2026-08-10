// The prescription. One entry per week; each day says exactly what to do,
// eat, prep, and buy. The coach (Claude) edits this file from what Dan
// reports: done flags, weigh-ins, notes, and next week's programming.
//
// Kitchen: Ninja Foodi Steam & Crisp (small). Dinners are cooked fresh in
// it with zero weeknight chopping (veg comes from Sunday bins or pre-cut
// bags). Lunches are packed Sunday/night-before and microwaved at work.
// `how` strings carry the exact appliance instructions.

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

// ---- Meals (items reference the food db: { id, q }) ----
// Lunches — packable, microwave-at-work friendly
const L_TURKEY_WRAP = [{ id: "turkey", q: 2 }, { id: "tortilla", q: 2 }, { id: "cheese", q: 1 }, { id: "babycarrot", q: 1 }, { id: "yogurt", q: 1 }];
const L_ROTI_WRAP = [{ id: "roti", q: 1 }, { id: "tortilla", q: 2 }, { id: "cheese", q: 1 }, { id: "cherrytom", q: 1 }, { id: "fruit", q: 1 }];
const L_TUNA_SANDWICH = [{ id: "tuna", q: 2 }, { id: "bread", q: 1 }, { id: "cheese", q: 1 }, { id: "babycarrot", q: 1 }, { id: "cottage", q: 1 }];
const L_CHICKEN_BOWL = [{ id: "salsachx", q: 1 }, { id: "ricebatch", q: 1 }, { id: "blackbeans", q: 1 }, { id: "salsa", q: 1 }, { id: "cheese", q: 1 }];
const L_EGGS_HOME = [{ id: "eggs", q: 1 }, { id: "sausage", q: 1 }, { id: "bread", q: 1 }, { id: "fruit", q: 1 }];

// Dinners — fresh out of the Foodi, no chopping
const D_THIGHS = [{ id: "thighsraw", q: 1 }, { id: "babypot", q: 1 }, { id: "greenbeans", q: 1 }, { id: "bbq", q: 1 }];
const D_SALMON = [{ id: "salmon", q: 1 }, { id: "broccoli", q: 1 }, { id: "babypot", q: 1 }];
const D_BURGERS = [{ id: "patties", q: 1 }, { id: "bread", q: 1 }, { id: "cheese", q: 1 }, { id: "slaw", q: 1 }];
const D_SHRIMP_TACOS = [{ id: "shrimp", q: 1 }, { id: "tortilla", q: 2 }, { id: "slaw", q: 1 }, { id: "salsa", q: 1 }, { id: "cheese", q: 1 }];
const D_PORK = [{ id: "porkloin", q: 1 }, { id: "sweetpot", q: 1 }, { id: "greenbeans", q: 1 }];
const D_BOWL_FRESH = [{ id: "salsachx", q: 1 }, { id: "ricebatch", q: 1 }, { id: "blackbeans", q: 1 }, { id: "cheese", q: 1 }, { id: "salsa", q: 1 }, { id: "pepperstrips", q: 1 }];

// Snacks / top-up
const S_DEFAULT = [{ id: "yogurt", q: 1 }, { id: "shake", q: 1 }];
const S_STICKS = [{ id: "meatstick", q: 2 }, { id: "yogurt", q: 1 }];
const S_BAR = [{ id: "bar", q: 1 }, { id: "cheesestick", q: 1 }];

const PACK_NOTE = "Pack it the night before; the work microwave is fine for reheating.";
const SNACK_NOTE = "Anytime inside the window. The zero-cal energy drink is fine even during the fast.";

export const WEEKS = [
  {
    week: 1,
    start: "2026-08-10", // Monday
    focus: "Week one. Checkmarks are the goal. This week's lunches are quick-assemble (first big Sunday prep is the 16th — after that, lunches come out of the batch).",
    weighIns: [{ date: "2026-08-10", lbs: 250 }],
    days: [
      {
        key: "mon", name: "Monday",
        workout: { title: "Walk + core trio", minutes: 25, items: [{ text: "20-min walk, easy pace" }, ...CORE_TRIO], after: "Shower right after." },
        meals: { m1: L_TURKEY_WRAP, m2: D_THIGHS, m3: S_STICKS },
        how: {
          m1: PACK_NOTE,
          m2: "Foodi: baby potatoes in the basket, Steam Crisp 390°F / 10 min. Add seasoned thighs on top, green beans around them, Steam Crisp 390°F / 15 more. Chicken reads 165°F inside = done.",
          m3: SNACK_NOTE,
        },
        prep: ["Weigh in (morning, before coffee) and tell the coach.", "Store run for the week: check the Buy list on the Food tab."],
      },
      {
        key: "tue", name: "Tuesday",
        workout: { title: "Strength A", minutes: 15, items: STRENGTH_A, after: "Stop every set 3–4 reps short of failure." },
        meals: { m1: L_ROTI_WRAP, m2: D_SALMON, m3: S_DEFAULT },
        how: {
          m1: PACK_NOTE,
          m2: "Foodi: potatoes in first, Steam Crisp 390°F / 10 min. Add salmon straight from frozen + broccoli, Steam Crisp 375°F / 15 more. Salmon flakes = done.",
          m3: SNACK_NOTE,
        },
        prep: [],
      },
      {
        key: "wed", name: "Wednesday",
        workout: { title: "Walk + core trio", minutes: 25, items: [{ text: "20-min walk, easy pace" }, ...CORE_TRIO], after: "Boil check tonight: calm = elliptical tomorrow, angry = walk instead." },
        meals: { m1: L_TUNA_SANDWICH, m2: D_BURGERS, m3: S_BAR },
        how: {
          m1: PACK_NOTE,
          m2: "Foodi: patties in the basket, Air Crisp 375°F / 9–11 min, flip once. Cheese on for the last minute. Slaw straight from the bag with its dressing.",
          m3: SNACK_NOTE,
        },
        prep: ["BP wash day (Mon/Wed/Fri)."],
      },
      {
        key: "thu", name: "Thursday",
        workout: { title: "Elliptical (or walk)", minutes: 20, items: [{ text: "Elliptical 20 min, conversational pace" }, { text: "Fallback if the boil is angry: 25-min walk" }], after: "Compression shorts + anti-chafe balm. Shower immediately after." },
        meals: { m1: L_TURKEY_WRAP, m2: D_SHRIMP_TACOS, m3: S_STICKS },
        how: {
          m1: PACK_NOTE,
          m2: "Foodi: shrimp from frozen, toss in taco seasoning, Steam Crisp 390°F / 8–10 min. Warm tortillas on top for the last 2. Build tacos with slaw + salsa.",
          m3: SNACK_NOTE,
        },
        prep: [],
      },
      {
        key: "fri", name: "Friday",
        workout: { title: "Strength A (again)", minutes: 15, items: STRENGTH_A, after: "Core trio optional if you feel good." },
        meals: { m1: L_ROTI_WRAP, m2: D_PORK, m3: S_DEFAULT },
        how: {
          m1: PACK_NOTE,
          m2: "Foodi: whole sweet potato, Steam Crisp 390°F / 15 min. Add the pre-marinated tenderloin + green beans, Steam Crisp 390°F / 15–18 more, until pork reads 145°F. Rest 5 min, slice.",
          m3: SNACK_NOTE,
        },
        prep: ["BP wash day."],
      },
      {
        key: "sat", name: "Saturday",
        workout: { title: "Walk somewhere new", minutes: 30, items: [{ text: "30-min walk: trailhead, park, river path. The get-out-of-the-car rep." }], after: "" },
        meals: { m1: L_EGGS_HOME, m2: D_THIGHS, m3: S_BAR },
        how: {
          m1: "Home lunch — eggs scramble in 5 min, sausage links in the Foodi (Air Crisp 375°F / 6 min) while you scramble.",
          m2: "Same as Monday night — the Foodi thigh dinner you already know.",
          m3: SNACK_NOTE,
        },
        prep: [],
      },
      {
        key: "sun", name: "Sunday",
        workout: { title: "Off", minutes: 0, items: [{ text: "Rest day. Shower anyway." }], after: "" },
        meals: { m1: L_EGGS_HOME, m2: D_BOWL_FRESH, m3: S_DEFAULT },
        how: {
          m1: "Same easy home lunch as Saturday.",
          m2: "Dinner is the first bowl out of the batch — taste-test night.",
          m3: SNACK_NOTE,
        },
        prep: [
          "THE SUNDAY HOUR (~60 min, feeds next week's lunches):",
          "1. Rice: 3 cups dry in a pot, ~25 min — start it first.",
          "2. Foodi round 1: seasoned chicken thighs, Steam Crisp 390°F / 18 min. Shred half into a bowl with a jar of salsa = salsa chicken.",
          "3. Foodi round 2 (while shredding): next tray of thighs or the week's marinated protein.",
          "4. Portion 5 lunch containers: salsa chicken + rice + black beans + cheese. Fridge holds 3–4 days — freeze Thursday/Friday's pair.",
          "5. Veg bins, 10 min: snap green beans, slice bell peppers (the week's ONE knife job — or buy pre-cut), tip cherry tomatoes and baby carrots into grab bins.",
          "6. Marinate anything for next week's dinners; label and fridge.",
        ],
        shoppingDay: true,
      },
    ],
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
  const w = WEEKS[WEEKS.length - 1];
  const dayIndex = (now.getDay() + 6) % 7; // Mon=0
  return { week: w, dayIndex, date: now, current: false };
}
