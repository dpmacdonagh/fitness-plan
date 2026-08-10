// Food database. Per-serving estimates — close enough to steer by.
// id: { name, cat, serving, kcal, protein, pack, perPack }
export const FOODS = {
  roti: { name: "Rotisserie chicken", cat: "protein", serving: "1/4 bird (~6 oz meat)", kcal: 300, protein: 40, pack: "whole chicken", perPack: 4 },
  strips: { name: "Grilled chicken strips", cat: "protein", serving: "6 oz", kcal: 250, protein: 45, pack: "bag", perPack: 3 },
  salsachx: { name: "Salsa chicken (batch)", cat: "protein", serving: "6 oz", kcal: 280, protein: 45, pack: "slow-cooker batch", perPack: 10 },
  beef: { name: "Taco beef 93%", cat: "protein", serving: "6 oz cooked", kcal: 340, protein: 45, pack: "2 lb pack", perPack: 4 },
  tuna: { name: "Canned tuna", cat: "protein", serving: "1 can", kcal: 100, protein: 20, pack: "can", perPack: 1 },
  canchx: { name: "Canned chicken", cat: "protein", serving: "1 can (12.5 oz)", kcal: 200, protein: 40, pack: "can", perPack: 1 },
  eggs: { name: "Eggs", cat: "protein", serving: "3 eggs", kcal: 210, protein: 18, pack: "dozen", perPack: 4 },
  sausage: { name: "Chicken sausage", cat: "protein", serving: "2 links", kcal: 200, protein: 22, pack: "pack", perPack: 3 },
  turkey: { name: "Deli turkey", cat: "protein", serving: "4 oz", kcal: 120, protein: 22, pack: "1 lb pack", perPack: 4 },
  yogurt: { name: "Greek yogurt (nonfat)", cat: "protein", serving: "1 cup", kcal: 130, protein: 23, pack: "32 oz tub", perPack: 4 },
  cottage: { name: "Cottage cheese", cat: "protein", serving: "1 cup", kcal: 180, protein: 25, pack: "tub", perPack: 2 },
  shake: { name: "Protein shake", cat: "protein", serving: "1 scoop + water", kcal: 120, protein: 24, pack: "tub (30 scoops)", perPack: 30 },
  rice: { name: "Microwave rice", cat: "starch", serving: "1/2 pouch", kcal: 120, protein: 2, pack: "pouch", perPack: 2 },
  tortilla: { name: "Tortilla 10\"", cat: "starch", serving: "1 tortilla", kcal: 210, protein: 6, pack: "8-pack", perPack: 8 },
  bread: { name: "Bread", cat: "starch", serving: "2 slices", kcal: 160, protein: 8, pack: "loaf", perPack: 10 },
  mash: { name: "Instant mashed potatoes", cat: "starch", serving: "3/4 cup prepared", kcal: 110, protein: 2, pack: "box", perPack: 8 },
  bakedpot: { name: "Microwave baked potato", cat: "starch", serving: "1 medium", kcal: 160, protein: 4, pack: "5 lb bag", perPack: 12 },
  blackbeans: { name: "Black beans", cat: "starch", serving: "1/2 can", kcal: 110, protein: 7, pack: "can", perPack: 2 },
  refried: { name: "Refried beans", cat: "starch", serving: "1/2 can", kcal: 120, protein: 7, pack: "can", perPack: 2 },
  frozpot: { name: "Frozen roasted potatoes", cat: "starch", serving: "1 serving", kcal: 130, protein: 2, pack: "bag", perPack: 4 },
  saladkit: { name: "Salad kit", cat: "veg", serving: "1/2 bag w/ dressing", kcal: 100, protein: 2, pack: "bag", perPack: 2 },
  steamveg: { name: "Frozen steamer veg", cat: "veg", serving: "1/2 bag", kcal: 40, protein: 2, pack: "bag", perPack: 2 },
  slaw: { name: "Coleslaw mix + dressing", cat: "veg", serving: "1 bowl", kcal: 120, protein: 1, pack: "bag", perPack: 2 },
  salsa: { name: "Salsa", cat: "extra", serving: "1/4 cup", kcal: 20, protein: 0, pack: "jar", perPack: 8 },
  cheese: { name: "Shredded cheese", cat: "extra", serving: "1 oz", kcal: 110, protein: 7, pack: "1 lb bag", perPack: 16 },
  bbq: { name: "BBQ sauce", cat: "extra", serving: "2 tbsp", kcal: 70, protein: 0, pack: "bottle", perPack: 12 },
  fruit: { name: "Fruit", cat: "extra", serving: "1 piece", kcal: 90, protein: 0, pack: "each", perPack: 1 },
  pb: { name: "Peanut butter", cat: "extra", serving: "2 tbsp", kcal: 190, protein: 7, pack: "jar", perPack: 16 },
  bar: { name: "Protein bar", cat: "extra", serving: "1 bar", kcal: 200, protein: 20, pack: "12-box", perPack: 12 },
  thighsraw: { name: "Chicken thighs (for the Foodi)", cat: "protein", serving: "2 thighs (~6 oz cooked)", kcal: 320, protein: 44, pack: "2.5 lb tray", perPack: 5 },
  salmon: { name: "Salmon fillet (frozen)", cat: "protein", serving: "1 fillet (6 oz)", kcal: 290, protein: 38, pack: "4-fillet bag", perPack: 4 },
  shrimp: { name: "Shrimp (frozen, peeled)", cat: "protein", serving: "8 oz", kcal: 240, protein: 46, pack: "2 lb bag", perPack: 4 },
  porkloin: { name: "Pork tenderloin (pre-marinated)", cat: "protein", serving: "6 oz cooked", kcal: 280, protein: 42, pack: "tenderloin", perPack: 3 },
  patties: { name: "Burger patties 90%", cat: "protein", serving: "2 patties (1/2 lb)", kcal: 380, protein: 44, pack: "8-pack", perPack: 4 },
  ricebatch: { name: "Rice (Sunday batch)", cat: "starch", serving: "1 cup cooked", kcal: 200, protein: 4, pack: "3-cup-dry batch", perPack: 9 },
  babypot: { name: "Baby potatoes (whole)", cat: "starch", serving: "~6 oz", kcal: 130, protein: 3, pack: "3 lb bag", perPack: 8 },
  sweetpot: { name: "Sweet potato (whole)", cat: "starch", serving: "1 medium", kcal: 160, protein: 3, pack: "5-pack", perPack: 5 },
  greenbeans: { name: "Green beans (snapped Sunday)", cat: "veg", serving: "big handful", kcal: 40, protein: 2, pack: "1 lb bag", perPack: 4 },
  broccoli: { name: "Broccoli florets (pre-cut bag)", cat: "veg", serving: "1.5 cups", kcal: 45, protein: 3, pack: "bag", perPack: 4 },
  pepperstrips: { name: "Bell pepper strips (Sunday bin)", cat: "veg", serving: "1 pepper's worth", kcal: 30, protein: 1, pack: "3-pack peppers", perPack: 3 },
  cherrytom: { name: "Cherry tomatoes", cat: "veg", serving: "1 cup", kcal: 30, protein: 1, pack: "pint", perPack: 2 },
  babycarrot: { name: "Baby carrots", cat: "veg", serving: "big handful", kcal: 35, protein: 1, pack: "1 lb bag", perPack: 5 },
  cheesestick: { name: "Cheese stick", cat: "extra", serving: "1 stick", kcal: 80, protein: 7, pack: "12-pack", perPack: 12 },
  meatstick: { name: "Meat stick", cat: "extra", serving: "1 stick", kcal: 110, protein: 9, pack: "12-pack", perPack: 12 },
  energy: { name: "Zero-cal energy drink", cat: "extra", serving: "1 can", kcal: 5, protein: 0, pack: "4-pack", perPack: 4 },
};

// Custom foods created in the app live in localStorage; resolve through here.
export function getFood(id, customFoods) {
  if (FOODS[id]) return FOODS[id];
  const c = customFoods && customFoods[id];
  return c ? { cat: "custom", serving: "1 serving", pack: "each", perPack: 1, ...c } : null;
}

export const CATS = [
  ["protein", "Protein"],
  ["starch", "Starch"],
  ["veg", "From a bag"],
  ["extra", "Extras"],
];

export const TARGET = { kcal: 2100, kcalLow: 1800, kcalHigh: 2300, pLow: 150, pHigh: 180 };

export function mealTotals(items, customFoods) {
  let kcal = 0, protein = 0;
  for (const it of items) {
    const f = getFood(it.id, customFoods);
    if (f) { kcal += f.kcal * it.q; protein += f.protein * it.q; }
  }
  return { kcal, protein };
}

export function dayMealTotals(meals, customFoods) {
  let kcal = 0, protein = 0;
  for (const slot of ["m1", "m2", "m3"]) {
    const t = mealTotals(meals[slot] || [], customFoods);
    kcal += t.kcal; protein += t.protein;
  }
  return { kcal, protein };
}
