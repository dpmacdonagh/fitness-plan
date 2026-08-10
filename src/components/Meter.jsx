export default function Meter({ label, value, unit, lo, hi, max, good }) {
  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <strong className={good ? "good" : ""}>{Math.round(value)} {unit}</strong>
      </div>
      <div className="meter-track">
        <div className="meter-band" style={{ left: `${(lo / max) * 100}%`, width: `${((hi - lo) / max) * 100}%` }} />
        <div className={"meter-fill" + (good ? " ok" : "")} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}
