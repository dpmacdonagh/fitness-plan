// The set menu. Three options per group — mix and match, all bulk-preppable.
// Every option has FIXED totals; nobody is weighing ingredients or eating
// spoons of peanut butter. `shop` is what the option costs the shopping
// list (per time it's scheduled); bought options cost nothing to prep.

export const TARGET = { kcal: 2100, kcalLow: 1800, kcalHigh: 2300, pLow: 150, pHigh: 180 };

// Ingredients exist only for the shopping list + pantry.
export const INGREDIENTS = {
  thighsraw: { name: "Chicken thighs", pack: "2.5 lb tray", perPack: 5 },
  salmon: { name: "Salmon fillets (frozen)", pack: "4-fillet bag", perPack: 4 },
  shrimp: { name: "Shrimp (frozen, peeled)", pack: "2 lb bag", perPack: 4 },
  ricedry: { name: "Rice (dry)", pack: "2 lb bag", perPack: 12 },
  blackbeans: { name: "Black beans", pack: "can", perPack: 2 },
  tortilla: { name: "Tortillas 10\"", pack: "8-pack", perPack: 8 },
  turkey: { name: "Deli turkey", pack: "1 lb pack", perPack: 4 },
  cheese: { name: "Shredded cheese", pack: "1 lb bag", perPack: 16 },
  babycarrot: { name: "Baby carrots", pack: "1 lb bag", perPack: 5 },
  yogurt: { name: "Greek yogurt (nonfat)", pack: "32 oz tub", perPack: 4 },
  shake: { name: "Protein powder", pack: "tub (30 scoops)", perPack: 30 },
  meatstick: { name: "Meat sticks", pack: "12-pack", perPack: 12 },
  cheesestick: { name: "Cheese sticks", pack: "12-pack", perPack: 12 },
  bar: { name: "Protein bars", pack: "12-box", perPack: 12 },
  babypot: { name: "Baby potatoes", pack: "3 lb bag", perPack: 8 },
  greenbeans: { name: "Green beans", pack: "1 lb bag", perPack: 4 },
  broccoli: { name: "Broccoli florets (pre-cut)", pack: "bag", perPack: 4 },
  slaw: { name: "Slaw mix + dressing", pack: "bag", perPack: 2 },
  salsa: { name: "Salsa", pack: "jar", perPack: 8 },
  bbq: { name: "BBQ sauce", pack: "bottle", perPack: 12 },
  fruit: { name: "Fruit", pack: "each", perPack: 1 },
  energy: { name: "Zero-cal energy drinks", pack: "4-pack", perPack: 4 },
};

export const MEALS = {
  // ---- Lunch (packed for work; L3 is the bought fallback) ----
  L1: {
    group: "lunch", name: "Batch bowl",
    desc: "Sunday-batch container: salsa chicken, rice, black beans, cheese. Microwave at work.",
    kcal: 860, protein: 85,
    shop: [["thighsraw", 1], ["ricedry", 1], ["blackbeans", 1], ["cheese", 1], ["salsa", 1]],
  },
  L2: {
    group: "lunch", name: "Turkey wrap kit",
    desc: "2 turkey + cheese wraps rolled the night before, baby carrots, a greek yogurt.",
    kcal: 930, protein: 85,
    shop: [["turkey", 2], ["tortilla", 2], ["cheese", 1], ["babycarrot", 1], ["yogurt", 1]],
  },
  L3: {
    group: "lunch", name: "Store-bought lunch", bought: true,
    desc: "Any grocery/deli premade sandwich or wrap + a meat stick + zero-cal drink. Forgot lunch? This is the plan, not a failure.",
    kcal: 800, protein: 50,
    shop: [],
  },

  // ---- Dinner (fresh from the Foodi, zero chopping) ----
  D1: {
    group: "dinner", name: "Thigh plate",
    desc: "Chicken thighs, baby potatoes, green beans, BBQ glaze.",
    how: "Foodi: potatoes in the basket, Steam Crisp 390°F / 10 min. Add seasoned thighs + green beans, Steam Crisp 390°F / 15 more. 165°F inside = done.",
    kcal: 850, protein: 70,
    shop: [["thighsraw", 1.5], ["babypot", 2], ["greenbeans", 1], ["bbq", 1]],
  },
  D2: {
    group: "dinner", name: "Salmon plate",
    desc: "Salmon straight from frozen, rice, broccoli.",
    how: "Foodi: salmon from frozen + broccoli, Steam Crisp 375°F / 15–17 min, until it flakes. Rice from the Sunday batch, splash of water, steam 3 min alongside or before.",
    kcal: 780, protein: 50,
    shop: [["salmon", 1], ["ricedry", 1], ["broccoli", 1]],
  },
  D3: {
    group: "dinner", name: "Shrimp tacos",
    desc: "Taco-seasoned shrimp, warm tortillas, slaw, salsa, cheese.",
    how: "Foodi: frozen shrimp tossed in taco seasoning, Steam Crisp 390°F / 8–10 min; tortillas on top for the last 2. Build with slaw + salsa.",
    kcal: 910, protein: 65,
    shop: [["shrimp", 1], ["tortilla", 2], ["slaw", 1], ["cheese", 1], ["salsa", 1]],
  },

  // ---- Snacks / top-up ----
  S1: {
    group: "snack", name: "Protein double",
    desc: "Greek yogurt + a protein shake. The default — closes the protein gap.",
    kcal: 250, protein: 47,
    shop: [["yogurt", 1], ["shake", 1]],
  },
  S2: {
    group: "snack", name: "Stick pack",
    desc: "2 meat sticks + a cheese stick. Glovebox/desk-drawer friendly.",
    kcal: 300, protein: 25,
    shop: [["meatstick", 2], ["cheesestick", 1]],
  },
  S3: {
    group: "snack", name: "Bar + fruit",
    desc: "Protein bar and a piece of fruit.",
    kcal: 290, protein: 20,
    shop: [["bar", 1], ["fruit", 1]],
  },

  // ---- Off-plan quick logs (pick when life happened) ----
  Q1: { group: "quick", name: "Gas station run", desc: "Meat sticks / jerky + a drink + whatever. Logged at a fair estimate.", kcal: 600, protein: 25, shop: [] },
  Q2: { group: "quick", name: "Fast food meal", desc: "Burger/sandwich combo, fair estimate.", kcal: 950, protein: 35, shop: [] },
  Q3: { group: "quick", name: "Grocery premade", desc: "Premade meal/sushi/hot bar box, fair estimate.", kcal: 650, protein: 30, shop: [] },
};

export const GROUPS = { m1: "lunch", m2: "dinner", m3: "snack" };

// Resolve a slot choice to displayable info. choice: null (use planned id),
// a meal id string, or { custom: true, name, kcal, protein }.
export function choiceInfo(choice, plannedId) {
  if (choice && choice.custom) {
    return { name: choice.name, desc: "Custom log.", kcal: choice.kcal, protein: choice.protein, custom: true };
  }
  const id = typeof choice === "string" ? choice : plannedId;
  return { id, ...(MEALS[id] || { name: "—", kcal: 0, protein: 0 }) };
}
