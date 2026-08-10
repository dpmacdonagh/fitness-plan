import { FOODS } from "../data/foods.js";
import { shoppingRows } from "../lib/plan.js";
import { setPantry, setShopChecked, update } from "../store.js";

export default function Shopping({ week, pantry, shopChecked }) {
  const rows = shoppingRows(week, pantry);
  if (!rows.length) return <p className="note">Nothing to buy — the pantry covers the whole week.</p>;
  return (
    <div className="shopping">
      <ul className="shop-list">
        {rows.map((r) => {
          const f = FOODS[r.id];
          return (
            <li key={r.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!shopChecked[r.id]}
                  onChange={(e) => setShopChecked(r.id, e.target.checked)}
                />
                <span>{r.packs} × {f.pack} — {f.name}</span>
                <span className="shop-why">{r.need} servings planned{r.have ? `, ${r.have} in pantry` : ""}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <button
        className="btn"
        onClick={() => {
          update((s) => {
            const pantryNext = { ...s.pantry };
            const checkedNext = { ...s.shopChecked };
            for (const r of shoppingRows(week, s.pantry)) {
              if (checkedNext[r.id]) {
                pantryNext[r.id] = (pantryNext[r.id] || 0) + r.packs * FOODS[r.id].perPack;
                checkedNext[r.id] = false;
              }
            }
            return { pantry: pantryNext, shopChecked: checkedNext };
          });
        }}
      >
        Bought the checked items → add to pantry
      </button>
    </div>
  );
}

export function Pantry({ pantry }) {
  return (
    <div className="pantry">
      {Object.keys(FOODS).map((id) => {
        const f = FOODS[id];
        const have = pantry[id] || 0;
        return (
          <div key={id} className={"prow" + (have > 0 ? " has" : "")}>
            <div className="pinfo">
              <span className="pname">{f.name}</span>
              <span className="punit">servings of {f.serving}</span>
            </div>
            <div className="pctl">
              <button className="step" aria-label={`One less ${f.name}`} onClick={() => setPantry(id, have - 1)}>−</button>
              <span className="pcount">{have}</span>
              <button className="step" aria-label={`One more ${f.name}`} onClick={() => setPantry(id, have + 1)}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
