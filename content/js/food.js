/* Interactive food planner: week plan -> live kcal/protein totals,
 * pantry -> what you already have, shopping list = plan minus pantry.
 * Vanilla JS, state in localStorage (per device/browser).
 * All macros are per-serving estimates — close enough to steer by.
 */
(function () {
  "use strict";

  var TARGET = { kcal: 2100, kcalLow: 1950, kcalHigh: 2300, pLow: 150, pHigh: 180 };

  // id: [name, category, serving label, kcal, protein g, pack label, servings per pack]
  var FOODS = {
    roti: ["Rotisserie chicken", "protein", "1/4 bird (~6 oz meat)", 300, 40, "whole chicken", 4],
    strips: ["Grilled chicken strips", "protein", "6 oz", 250, 45, "bag", 3],
    salsachx: ["Salsa chicken (batch)", "protein", "6 oz", 280, 45, "slow-cooker batch", 10],
    beef: ["Taco beef 93%", "protein", "6 oz cooked", 340, 45, "2 lb pack", 4],
    tuna: ["Canned tuna", "protein", "1 can", 100, 20, "can", 1],
    canchx: ["Canned chicken", "protein", "1 can (12.5 oz)", 200, 40, "can", 1],
    eggs: ["Eggs", "protein", "3 eggs", 210, 18, "dozen", 4],
    sausage: ["Chicken sausage", "protein", "2 links", 200, 22, "pack", 3],
    turkey: ["Deli turkey", "protein", "4 oz", 120, 22, "1 lb pack", 4],
    yogurt: ["Greek yogurt (nonfat)", "protein", "1 cup", 130, 23, "32 oz tub", 4],
    cottage: ["Cottage cheese", "protein", "1 cup", 180, 25, "tub", 2],
    shake: ["Protein shake", "protein", "1 scoop + water", 120, 24, "tub (30 scoops)", 30],
    rice: ["Microwave rice", "starch", "1/2 pouch", 120, 2, "pouch", 2],
    tortilla: ["Tortilla 10\"", "starch", "1 tortilla", 210, 6, "8-pack", 8],
    bread: ["Bread", "starch", "2 slices", 160, 8, "loaf", 10],
    mash: ["Instant mashed potatoes", "starch", "3/4 cup prepared", 110, 2, "box", 8],
    bakedpot: ["Microwave baked potato", "starch", "1 medium", 160, 4, "5 lb bag", 12],
    blackbeans: ["Black beans", "starch", "1/2 can", 110, 7, "can", 2],
    refried: ["Refried beans", "starch", "1/2 can", 120, 7, "can", 2],
    frozpot: ["Frozen roasted potatoes", "starch", "1 serving", 130, 2, "bag", 4],
    saladkit: ["Salad kit", "veg", "1/2 bag w/ dressing", 100, 2, "bag", 2],
    steamveg: ["Frozen steamer veg", "veg", "1/2 bag", 40, 2, "bag", 2],
    slaw: ["Coleslaw mix + dressing", "veg", "1 bowl", 120, 1, "bag", 2],
    salsa: ["Salsa", "extra", "1/4 cup", 20, 0, "jar", 8],
    cheese: ["Shredded cheese", "extra", "1 oz", 110, 7, "1 lb bag", 16],
    bbq: ["BBQ sauce", "extra", "2 tbsp", 70, 0, "bottle", 12],
    fruit: ["Fruit", "extra", "1 piece", 90, 0, "each", 1],
    pb: ["Peanut butter", "extra", "2 tbsp", 190, 7, "jar", 16],
    bar: ["Protein bar", "extra", "1 bar", 200, 20, "12-box", 12],
  };
  var CATS = [["protein", "Protein"], ["starch", "Starch"], ["veg", "From a bag"], ["extra", "Extras"]];
  var DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var DAY_NAMES = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
  var SLOTS = [["m1", "Meal 1 · noon"], ["m2", "Meal 2 · evening"], ["m3", "Top-up (if protein is short)"]];

  var LS_KEY = "fitfood-v1";

  function defaultDay() {
    return {
      m1: [{ id: "salsachx", q: 1 }, { id: "rice", q: 1 }, { id: "tortilla", q: 2 }, { id: "cheese", q: 1 }, { id: "salsa", q: 1 }],
      m2: [{ id: "roti", q: 1 }, { id: "bakedpot", q: 1 }, { id: "steamveg", q: 1 }, { id: "fruit", q: 1 }, { id: "pb", q: 1 }],
      m3: [{ id: "yogurt", q: 1 }, { id: "shake", q: 1 }],
    };
  }
  function defaultState() {
    var week = {};
    DAYS.forEach(function (d) { week[d] = defaultDay(); });
    return { week: week, pantry: {}, checked: {}, day: "mon" };
  }

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(LS_KEY));
      if (s && s.week && s.pantry) return s;
    } catch (e) { /* fall through */ }
    return defaultState();
  }
  var state = load();
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ } }

  var openPicker = null; // "day:slot" whose food picker is expanded

  // ---- math ----
  function slotTotals(items) {
    var k = 0, p = 0;
    items.forEach(function (it) { var f = FOODS[it.id]; if (f) { k += f[3] * it.q; p += f[4] * it.q; } });
    return { k: k, p: p };
  }
  function dayTotals(day) {
    var k = 0, p = 0;
    SLOTS.forEach(function (s) { var t = slotTotals(day[s[0]] || []); k += t.k; p += t.p; });
    return { k: k, p: p };
  }
  function weekNeeds() {
    var need = {};
    DAYS.forEach(function (d) {
      SLOTS.forEach(function (s) {
        (state.week[d][s[0]] || []).forEach(function (it) { need[it.id] = (need[it.id] || 0) + it.q; });
      });
    });
    return need;
  }
  function shoppingRows() {
    var need = weekNeeds(), rows = [];
    Object.keys(need).forEach(function (id) {
      var have = state.pantry[id] || 0;
      var remaining = need[id] - have;
      if (remaining > 0) {
        var f = FOODS[id];
        rows.push({ id: id, packs: Math.ceil(remaining / f[6]), need: need[id], have: have });
      }
    });
    rows.sort(function (a, b) { return FOODS[a.id][0] < FOODS[b.id][0] ? -1 : 1; });
    return rows;
  }

  // ---- rendering ----
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function kcalClass(k) { return k >= TARGET.kcalLow && k <= TARGET.kcalHigh ? "ok" : (k > TARGET.kcalHigh ? "over" : "under"); }
  function protClass(p) { return p >= TARGET.pLow ? "ok" : "under"; }

  function renderDayPills(root) {
    var wrap = h("div", "fp-days");
    DAYS.forEach(function (d) {
      var t = dayTotals(state.week[d]);
      var b = h("button", "fp-day" + (state.day === d ? " active" : ""));
      b.appendChild(h("span", "fp-day-name", DAY_NAMES[d]));
      var dot = h("span", "fp-dot " + (kcalClass(t.k) === "ok" && protClass(t.p) === "ok" ? "ok" : "off"));
      b.appendChild(dot);
      b.onclick = function () { state.day = d; openPicker = null; save(); render(); };
      wrap.appendChild(b);
    });
    root.appendChild(wrap);
  }

  function meter(label, val, lo, hi, max, cls) {
    var wrap = h("div", "fp-meter");
    var head = h("div", "fp-meter-head");
    head.appendChild(h("span", null, label));
    head.appendChild(h("strong", "fp-" + cls, Math.round(val) + (label.indexOf("Protein") === 0 ? " g" : " kcal")));
    wrap.appendChild(head);
    var track = h("div", "fp-track");
    var band = h("div", "fp-band");
    band.style.left = (lo / max * 100) + "%";
    band.style.width = ((hi - lo) / max * 100) + "%";
    track.appendChild(band);
    var fill = h("div", "fp-fill fp-bg-" + cls);
    fill.style.width = Math.min(100, val / max * 100) + "%";
    track.appendChild(fill);
    wrap.appendChild(track);
    return wrap;
  }

  function renderDay(root) {
    var day = state.week[state.day];
    var t = dayTotals(day);
    var totals = h("div", "fp-totals");
    totals.appendChild(meter("Calories (target " + TARGET.kcalLow + "–" + TARGET.kcalHigh + ")", t.k, TARGET.kcalLow, TARGET.kcalHigh, 3000, kcalClass(t.k)));
    totals.appendChild(meter("Protein (target " + TARGET.pLow + "–" + TARGET.pHigh + ")", t.p, TARGET.pLow, TARGET.pHigh, 220, protClass(t.p)));
    root.appendChild(totals);

    SLOTS.forEach(function (s) {
      var slotKey = s[0], items = day[slotKey] || [];
      var box = h("div", "fp-slot");
      var st = slotTotals(items);
      var head = h("div", "fp-slot-head");
      head.appendChild(h("strong", null, s[1]));
      head.appendChild(h("span", "fp-slot-macros", Math.round(st.k) + " kcal · " + Math.round(st.p) + " g protein"));
      box.appendChild(head);

      var chips = h("div", "fp-chips");
      items.forEach(function (it, idx) {
        var f = FOODS[it.id];
        var chip = h("span", "fp-chip");
        chip.appendChild(h("span", null, f[0] + (it.q > 1 ? " ×" + it.q : "")));
        var minus = h("button", "fp-chip-x", "−");
        minus.setAttribute("aria-label", "Remove one " + f[0]);
        minus.onclick = function () {
          it.q -= 1;
          if (it.q <= 0) items.splice(idx, 1);
          save(); render();
        };
        chip.appendChild(minus);
        chips.appendChild(chip);
      });
      box.appendChild(chips);

      var pickKey = state.day + ":" + slotKey;
      var addBtn = h("button", "fp-add", openPicker === pickKey ? "close" : "+ add food");
      addBtn.onclick = function () { openPicker = openPicker === pickKey ? null : pickKey; render(); };
      box.appendChild(addBtn);

      if (openPicker === pickKey) {
        var picker = h("div", "fp-picker");
        CATS.forEach(function (c) {
          picker.appendChild(h("div", "fp-cat", c[1]));
          var grid = h("div", "fp-grid");
          Object.keys(FOODS).forEach(function (id) {
            var f = FOODS[id];
            if (f[1] !== c[0]) return;
            var btn = h("button", "fp-food");
            btn.appendChild(h("span", "fp-food-name", f[0]));
            btn.appendChild(h("span", "fp-food-info", f[2] + " · " + f[3] + " kcal · " + f[4] + " g"));
            btn.onclick = function () {
              var existing = null;
              items.forEach(function (it) { if (it.id === id) existing = it; });
              if (existing) existing.q += 1; else items.push({ id: id, q: 1 });
              day[slotKey] = items;
              save(); render();
            };
            grid.appendChild(btn);
          });
          picker.appendChild(grid);
        });
        box.appendChild(picker);
      }
      root.appendChild(box);
    });

    var tools = h("div", "fp-tools");
    var copy = h("button", "fp-btn", "Copy " + DAY_NAMES[state.day] + " to every day");
    copy.onclick = function () {
      var src = JSON.stringify(state.week[state.day]);
      DAYS.forEach(function (d) { state.week[d] = JSON.parse(src); });
      save(); render();
    };
    tools.appendChild(copy);
    var reset = h("button", "fp-btn", "Reset planner");
    reset.onclick = function () {
      if (confirm("Reset the week plan, pantry, and shopping list to defaults?")) {
        state = defaultState(); save(); render();
      }
    };
    tools.appendChild(reset);
    root.appendChild(tools);
  }

  function renderShopping(root) {
    var rows = shoppingRows();
    if (!rows.length) {
      root.appendChild(h("p", "fp-note", "Nothing to buy — the pantry covers the whole week."));
      return;
    }
    var list = h("ul", "fp-shop");
    rows.forEach(function (r) {
      var f = FOODS[r.id];
      var li = h("li");
      var lab = h("label");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!state.checked[r.id];
      cb.onchange = function () { state.checked[r.id] = cb.checked; save(); };
      lab.appendChild(cb);
      var txt = r.packs + " × " + f[5] + " — " + f[0];
      lab.appendChild(h("span", null, " " + txt));
      lab.appendChild(h("span", "fp-shop-why", r.need + " servings planned" + (r.have ? ", " + r.have + " in pantry" : "")));
      li.appendChild(lab);
      list.appendChild(li);
    });
    root.appendChild(list);
    var done = h("button", "fp-btn", "I bought the checked items → add to pantry");
    done.onclick = function () {
      rows.forEach(function (r) {
        if (state.checked[r.id]) {
          state.pantry[r.id] = (state.pantry[r.id] || 0) + r.packs * FOODS[r.id][6];
          state.checked[r.id] = false;
        }
      });
      save(); render();
    };
    root.appendChild(done);
  }

  function renderPantry(root) {
    var list = h("div", "fp-pantry");
    Object.keys(FOODS).forEach(function (id) {
      var f = FOODS[id];
      var have = state.pantry[id] || 0;
      var row = h("div", "fp-prow" + (have > 0 ? " has" : ""));
      var info = h("div", "fp-pinfo");
      info.appendChild(h("span", "fp-pname", f[0]));
      info.appendChild(h("span", "fp-punit", "servings of " + f[2]));
      row.appendChild(info);
      var ctl = h("div", "fp-pctl");
      var minus = h("button", "fp-step", "−");
      minus.setAttribute("aria-label", "One less " + f[0]);
      minus.onclick = function () { state.pantry[id] = Math.max(0, have - 1); save(); render(); };
      ctl.appendChild(minus);
      ctl.appendChild(h("span", "fp-count", String(have)));
      var plus = h("button", "fp-step", "+");
      plus.setAttribute("aria-label", "One more " + f[0]);
      plus.onclick = function () { state.pantry[id] = have + 1; save(); render(); };
      ctl.appendChild(plus);
      row.appendChild(ctl);
      list.appendChild(row);
    });
    root.appendChild(list);
  }

  var roots = {};
  function render() {
    ["planner", "shopping", "pantry"].forEach(function (k) {
      if (roots[k]) roots[k].textContent = "";
    });
    if (roots.planner) { renderDayPills(roots.planner); renderDay(roots.planner); }
    if (roots.shopping) renderShopping(roots.shopping);
    if (roots.pantry) renderPantry(roots.pantry);
  }

  function init() {
    roots.planner = document.getElementById("food-planner");
    roots.shopping = document.getElementById("food-shopping");
    roots.pantry = document.getElementById("food-pantry");
    if (!roots.planner) return;
    render();
  }

  window.FOODPLAN = { state: function () { return state; }, render: render };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
