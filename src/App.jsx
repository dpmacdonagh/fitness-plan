import { useEffect, useState } from "react";
import { useStore } from "./store.js";
import { WEEKS, findToday } from "./data/weeks.js";
import { weekAdherence } from "./lib/plan.js";
import DayCard from "./components/DayCard.jsx";
import { Pantry } from "./components/Shopping.jsx";
import Shopping from "./components/Shopping.jsx";
import ProgressScreen from "./screens/Progress.jsx";
import LibraryScreen from "./screens/Library.jsx";

const TABS = [
  ["today", "Today"],
  ["week", "Week"],
  ["food", "Food"],
  ["progress", "Progress"],
  ["library", "Guide"],
];

function useHashTab() {
  const read = () => (location.hash.replace(/^#\/?/, "") || "today").split("/")[0];
  const [tab, setTab] = useState(read);
  useEffect(() => {
    const onHash = () => setTab(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [TABS.some(([k]) => k === tab) ? tab : "today", (t) => { location.hash = `/${t}`; }];
}

function fmtDate(d) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function App() {
  const store = useStore();
  const [tab, setTab] = useHashTab();
  const now = new Date();
  const { week, dayIndex, current } = findToday(now);
  const day = week.days[dayIndex];
  const [weekDay, setWeekDay] = useState(dayIndex);

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>{TABS.find(([k]) => k === tab)[1] === "Today" ? fmtDate(now) : TABS.find(([k]) => k === tab)[1]}</h1>
          <p className="topbar-sub">
            {tab === "today"
              ? `Week ${week.week}, day ${dayIndex + 1}${current ? "" : " (nearest programmed week)"}`
              : `Week ${week.week} · ${weekAdherence(week, store.done).done}/${weekAdherence(week, store.done).total} boxes`}
          </p>
        </div>
      </header>

      <main className="content">
        {tab === "today" && (
          <>
            {week.focus && <p className="focus">{week.focus}</p>}
            <DayCard week={week} day={day} localDone={store.done} pantry={store.pantry} shopChecked={store.shopChecked} isToday />
          </>
        )}

        {tab === "week" && (
          <>
            <div className="day-pills">
              {week.days.map((d, i) => (
                <button
                  key={d.key}
                  className={"pill" + (i === weekDay ? " active" : "") + (i === dayIndex && current ? " is-today" : "")}
                  onClick={() => setWeekDay(i)}
                >
                  {d.name.slice(0, 3)}
                </button>
              ))}
            </div>
            <DayCard week={week} day={week.days[weekDay]} localDone={store.done} pantry={store.pantry} shopChecked={store.shopChecked} />
          </>
        )}

        {tab === "food" && (
          <>
            <section className="card">
              <div className="card-tag">This week's shopping</div>
              <p className="note">Computed from the week's prescribed meals minus your pantry, rounded to real packages.</p>
              <Shopping week={week} pantry={store.pantry} shopChecked={store.shopChecked} />
            </section>
            <section className="card">
              <div className="card-tag">Pantry</div>
              <p className="note">What you already have, in servings. Buying via the button fills this in; eat off-plan, knock it down by hand.</p>
              <Pantry pantry={store.pantry} />
            </section>
          </>
        )}

        {tab === "progress" && <ProgressScreen store={store} />}
        {tab === "library" && <LibraryScreen />}
      </main>

      <nav className="tabbar">
        {TABS.map(([key, label]) => (
          <button key={key} className={"tab" + (tab === key ? " active" : "")} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
