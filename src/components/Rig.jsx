import { useEffect, useRef } from "react";
import { BONES, FAR, DRAW_ORDER, EXERCISES } from "../data/exercises.js";

const RAD = Math.PI / 180;

function fk(pose) {
  const pts = { root: { x: pose.root[0], y: pose.root[1] } };
  const out = {};
  function solve(name) {
    if (out[name]) return out[name];
    const [parent, len] = BONES[name];
    const start = parent === "root" ? pts.root : solve(parent).end;
    const a = pose.a[name] * RAD;
    const end = { x: start.x + len * Math.cos(a), y: start.y + len * Math.sin(a) };
    out[name] = { start, end };
    return out[name];
  }
  for (const n in BONES) solve(n);
  return out;
}

const lerp = (a, b, t) => a + (b - a) * t;
const lerpAngle = (a, b, t) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;
const ease = (t) => t * t * (3 - 2 * t);

function poseAt(ex, time01) {
  const keys = ex.keys;
  const t = time01 % 1;
  let i = 0;
  while (i < keys.length - 1 && keys[i + 1].t < t) i++;
  const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
  const span = k1.t - k0.t;
  const f = span > 0 ? ease((t - k0.t) / span) : 0;
  const pose = { root: [lerp(k0.root[0], k1.root[0], f), lerp(k0.root[1], k1.root[1], f)], a: {} };
  for (const n in BONES) pose.a[n] = lerpAngle(k0.a[n], k1.a[n], f);
  return pose;
}

export default function Rig({ id }) {
  const ref = useRef(null);
  const ex = EXERCISES[id];

  useEffect(() => {
    if (!ex || !ref.current) return;
    const svg = ref.current;
    const lines = {};
    DRAW_ORDER.forEach((b) => {
      lines[b] = svg.querySelector(`[data-bone="${b}"]`);
    });
    const head = svg.querySelector("[data-head]");

    function draw(t01) {
      const joints = fk(poseAt(ex, t01));
      DRAW_ORDER.forEach((b) => {
        const j = joints[b];
        lines[b].setAttribute("x1", j.start.x.toFixed(1));
        lines[b].setAttribute("y1", j.start.y.toFixed(1));
        lines[b].setAttribute("x2", j.end.x.toFixed(1));
        lines[b].setAttribute("y2", j.end.y.toFixed(1));
      });
      const neck = joints.neck;
      const dx = neck.end.x - neck.start.x, dy = neck.end.y - neck.start.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      head.setAttribute("cx", (neck.end.x + (dx / len) * 8).toFixed(1));
      head.setAttribute("cy", (neck.end.y + (dy / len) * 8).toFixed(1));
    }

    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(ex.keys[ex.still].t);
      return;
    }
    let raf, start = null;
    const tick = (now) => {
      if (start === null) start = now;
      draw(((now - start) % ex.dur) / ex.dur);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id]);

  if (!ex) return null;
  const v = ex.view;
  return (
    <svg ref={ref} className="rig" viewBox={v.join(" ")} role="img" aria-label={`Animated demo: ${ex.name}`}>
      {ex.props.map((p, i) =>
        p.ground ? (
          <line key={i} className="rig-ground" x1={v[0]} y1={0} x2={v[0] + v[2]} y2={0} />
        ) : (
          <rect key={i} className="rig-prop" x={p.rect[0]} y={p.rect[1]} width={p.rect[2]} height={p.rect[3]} rx={3} />
        )
      )}
      {DRAW_ORDER.map((b) => (
        <line key={b} data-bone={b} className={"rig-bone" + (FAR[b] ? " rig-far" : "")} />
      ))}
      <circle data-head="1" className="rig-head" r={10} />
    </svg>
  );
}
