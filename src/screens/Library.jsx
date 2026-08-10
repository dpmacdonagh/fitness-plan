import { EXERCISES, RULES } from "../data/exercises.js";
import Rig from "../components/Rig.jsx";

export default function LibraryScreen() {
  return (
    <>
      <h2>The rules (permanent)</h2>
      {RULES.map((r) => (
        <section className="card" key={r.title}>
          <h3>{r.title}</h3>
          <ul className="cues">{r.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
        </section>
      ))}

      <h2>Every movement</h2>
      <p className="note">Watch the shape the body makes, then match it. Slow and controlled beats fast, every time.</p>
      {Object.entries(EXERCISES).map(([id, ex]) => (
        <section className="card" key={id}>
          <h3>{ex.name}</h3>
          <p className="note">{ex.summary}</p>
          <Rig id={id} />
          <ul className="cues">{ex.cues.map((c, i) => <li key={i}>{c}</li>)}</ul>
          {ex.caution && <p className="caution">{ex.caution}</p>}
        </section>
      ))}

      <h2>Cardio</h2>
      <section className="card">
        <ul className="cues">
          <li><strong>Walking:</strong> brisk enough to breathe deeper, easy enough to talk in full sentences. Compression shorts + anti-chafe balm every time.</li>
          <li><strong>Elliptical:</strong> conversational pace. The aerobic base that eventually bikes across America is built at easy pace, not by suffering.</li>
        </ul>
      </section>
    </>
  );
}
