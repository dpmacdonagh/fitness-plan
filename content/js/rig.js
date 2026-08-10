/* Stick-figure exercise demos.
 *
 * A 2D bone rig: every bone starts where its parent ends (root = pelvis),
 * and a pose gives each bone a world-space angle in degrees
 * (0 = right, 90 = down, -90 = up; y is down, ground is y = 0).
 * An exercise is a list of keyframe poses; the engine interpolates
 * between them with easing and loops, like a GIF.
 *
 * Angles are data — to fix a movement, edit the numbers in EXERCISES.
 */
(function () {
  "use strict";

  // bone: [parent, length]. Children start at the parent's endpoint.
  // torso + thighs hang off the root (pelvis); arms + neck off the torso end (chest).
  var BONES = {
    torso: ["root", 55],
    neck: ["torso", 14],
    uarmF: ["torso", 28],
    farmF: ["uarmF", 24],
    uarmN: ["torso", 28],
    farmN: ["uarmN", 24],
    thighF: ["root", 45],
    shinF: ["thighF", 42],
    footF: ["shinF", 14],
    thighN: ["root", 45],
    shinN: ["thighN", 42],
    footN: ["shinN", 14],
  };
  var FAR = { uarmF: 1, farmF: 1, thighF: 1, shinF: 1, footF: 1 };
  var DRAW_ORDER = [
    "uarmF", "farmF", "thighF", "shinF", "footF",
    "torso", "thighN", "shinN", "footN", "neck", "uarmN", "farmN",
  ];

  var RAD = Math.PI / 180;

  function fk(pose) {
    // Forward kinematics: world start/end point of every bone.
    var pts = { root: { x: pose.root[0], y: pose.root[1] } };
    var out = {};
    function solve(name) {
      if (out[name]) return out[name];
      var b = BONES[name];
      var start = b[0] === "root" ? pts.root : solve(b[0]).end;
      var a = pose.a[name] * RAD;
      var end = { x: start.x + b[1] * Math.cos(a), y: start.y + b[1] * Math.sin(a) };
      out[name] = { start: start, end: end };
      return out[name];
    }
    for (var n in BONES) solve(n);
    return out;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpAngle(a, b, t) {
    var d = ((b - a) % 360 + 540) % 360 - 180; // shortest path
    return a + d * t;
  }
  function ease(t) { return t * t * (3 - 2 * t); } // smoothstep

  function poseAt(ex, time01) {
    var keys = ex.keys;
    var t = time01 % 1;
    var i = 0;
    while (i < keys.length - 1 && keys[i + 1].t < t) i++;
    var k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
    var span = k1.t - k0.t;
    var f = span > 0 ? ease((t - k0.t) / span) : 0;
    var pose = { root: [lerp(k0.root[0], k1.root[0], f), lerp(k0.root[1], k1.root[1], f)], a: {} };
    for (var n in BONES) pose.a[n] = lerpAngle(k0.a[n], k1.a[n], f);
    return pose;
  }

  // ---- Exercise definitions -------------------------------------------------
  // view: [x, y, w, h] SVG viewBox. props: static scenery. still: keyframe
  // index shown when the viewer prefers reduced motion.

  var EXERCISES = {
    "glute-bridge": {
      dur: 4200,
      view: [-110, -80, 205, 100],
      still: 1,
      props: [{ ground: true }],
      keys: [
        { t: 0.0, root: [0, -10], a: { torso: 180, neck: 180, uarmF: 25, farmF: 5, uarmN: 22, farmN: 2, thighF: -50, shinF: 97, footF: 12, thighN: -54, shinN: 95, footN: 10 } },
        { t: 0.38, root: [0, -26], a: { torso: 164, neck: 170, uarmF: 32, farmF: 8, uarmN: 30, farmN: 5, thighF: -17, shinF: 118, footF: 12, thighN: -19, shinN: 117, footN: 10 } },
        { t: 0.62, root: [0, -26], a: { torso: 164, neck: 170, uarmF: 32, farmF: 8, uarmN: 30, farmN: 5, thighF: -17, shinF: 118, footF: 12, thighN: -19, shinN: 117, footN: 10 } },
        { t: 1.0, root: [0, -10], a: { torso: 180, neck: 180, uarmF: 25, farmF: 5, uarmN: 22, farmN: 2, thighF: -50, shinF: 97, footF: 12, thighN: -54, shinN: 95, footN: 10 } },
      ],
    },

    "curl-up": {
      dur: 5600,
      view: [-115, -70, 230, 90],
      still: 1,
      props: [{ ground: true }],
      keys: [
        { t: 0.0, root: [0, -11], a: { torso: 180, neck: 180, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
        { t: 0.2, root: [0, -11], a: { torso: 186, neck: 186, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
        { t: 0.75, root: [0, -11], a: { torso: 186, neck: 186, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
        { t: 1.0, root: [0, -11], a: { torso: 180, neck: 180, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
      ],
    },

    "bird-dog": {
      dur: 6000,
      view: [-125, -95, 235, 115],
      still: 1,
      props: [{ ground: true }],
      keys: [
        { t: 0.0, root: [0, -46], a: { torso: -3, neck: 8, uarmF: 114, farmF: 63, uarmN: 111, farmN: 60, thighF: 96, shinF: 177, footF: 183, thighN: 100, shinN: 178, footN: 182 } },
        { t: 0.3, root: [0, -46], a: { torso: -3, neck: 4, uarmF: -6, farmF: -3, uarmN: 111, farmN: 60, thighF: 184, shinF: 179, footF: 186, thighN: 100, shinN: 178, footN: 182 } },
        { t: 0.72, root: [0, -46], a: { torso: -3, neck: 4, uarmF: -6, farmF: -3, uarmN: 111, farmN: 60, thighF: 184, shinF: 179, footF: 186, thighN: 100, shinN: 178, footN: 182 } },
        { t: 1.0, root: [0, -46], a: { torso: -3, neck: 8, uarmF: 114, farmF: 63, uarmN: 111, farmN: 60, thighF: 96, shinF: 177, footF: 183, thighN: 100, shinN: 178, footN: 182 } },
      ],
    },

    "side-plank": {
      dur: 5000,
      view: [-120, -65, 225, 85],
      still: 1,
      props: [{ ground: true }],
      keys: [
        { t: 0.0, root: [1, -4], a: { torso: -24, neck: -18, uarmF: 158, farmF: 162, uarmN: 92, farmN: 0, thighF: 175, shinF: 178, footF: 181, thighN: 179, shinN: 181, footN: 184 } },
        { t: 0.32, root: [-2, -20], a: { torso: -7, neck: -6, uarmF: 168, farmF: 172, uarmN: 98, farmN: 0, thighF: 156, shinF: 176, footF: 180, thighN: 160, shinN: 178, footN: 182 } },
        { t: 0.7, root: [-2, -20], a: { torso: -7, neck: -6, uarmF: 168, farmF: 172, uarmN: 98, farmN: 0, thighF: 156, shinF: 176, footF: 180, thighN: 160, shinN: 178, footN: 182 } },
        { t: 1.0, root: [1, -4], a: { torso: -24, neck: -18, uarmF: 158, farmF: 162, uarmN: 92, farmN: 0, thighF: 175, shinF: 178, footF: 181, thighN: 179, shinN: 181, footN: 184 } },
      ],
    },

    "incline-pushup": {
      dur: 3600,
      view: [-45, -145, 250, 160],
      still: 2,
      props: [{ ground: true }, { rect: [136, -68, 54, 68] }],
      keys: [
        { t: 0.0, root: [61.5, -65.5], a: { torso: -45, neck: -45, uarmF: 47, farmF: 47, uarmN: 45, farmN: 45, thighF: 137, shinF: 137, footF: 6, thighN: 135, shinN: 135, footN: 3 } },
        { t: 0.45, root: [55.6, -55.9], a: { torso: -41, neck: -41, uarmF: 79, farmF: 8, uarmN: 77, farmN: 6, thighF: 141, shinF: 141, footF: 6, thighN: 139, shinN: 139, footN: 3 } },
        { t: 0.6, root: [55.6, -55.9], a: { torso: -41, neck: -41, uarmF: 79, farmF: 8, uarmN: 77, farmN: 6, thighF: 141, shinF: 141, footF: 6, thighN: 139, shinN: 139, footN: 3 } },
        { t: 1.0, root: [61.5, -65.5], a: { torso: -45, neck: -45, uarmF: 47, farmF: 47, uarmN: 45, farmN: 45, thighF: 137, shinF: 137, footF: 6, thighN: 135, shinN: 135, footN: 3 } },
      ],
    },

    "chair-squat": {
      dur: 4400,
      view: [-85, -192, 145, 207],
      still: 1,
      props: [
        { ground: true },
        { rect: [-62, -52, 40, 52] },
        { rect: [-68, -108, 8, 108] },
      ],
      keys: [
        { t: 0.0, root: [6, -91], a: { torso: -87, neck: -87, uarmF: 95, farmF: 95, uarmN: 92, farmN: 92, thighF: 92, shinF: 92, footF: 7, thighN: 89, shinN: 89, footN: 5 } },
        { t: 0.42, root: [-16, -56], a: { torso: -60, neck: -62, uarmF: 10, farmF: 7, uarmN: 8, farmN: 5, thighF: 24, shinF: 121, footF: 7, thighN: 21, shinN: 118, footN: 5 } },
        { t: 0.58, root: [-16, -56], a: { torso: -60, neck: -62, uarmF: 10, farmF: 7, uarmN: 8, farmN: 5, thighF: 24, shinF: 121, footF: 7, thighN: 21, shinN: 118, footN: 5 } },
        { t: 1.0, root: [6, -91], a: { torso: -87, neck: -87, uarmF: 95, farmF: 95, uarmN: 92, farmN: 92, thighF: 92, shinF: 92, footF: 7, thighN: 89, shinN: 89, footN: 5 } },
      ],
    },
  };

  // ---- Rendering ------------------------------------------------------------

  var SVG_NS = "http://www.w3.org/2000/svg";
  var frozen = {}; // name -> time01, for testing/screenshots

  function el(name, attrs, parent) {
    var e = document.createElementNS(SVG_NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function setup(svg) {
    var name = svg.getAttribute("data-rig");
    var ex = EXERCISES[name];
    if (!ex) return;
    var v = ex.view;
    svg.setAttribute("viewBox", v.join(" "));
    svg.classList.add("rig");

    // scenery
    ex.props.forEach(function (p) {
      if (p.ground) {
        el("line", { x1: v[0], y1: 0, x2: v[0] + v[2], y2: 0, class: "rig-ground" }, svg);
      } else if (p.rect) {
        el("rect", { x: p.rect[0], y: p.rect[1], width: p.rect[2], height: p.rect[3], rx: 3, class: "rig-prop" }, svg);
      }
    });

    // bones + head
    var lines = {};
    DRAW_ORDER.forEach(function (b) {
      lines[b] = el("line", { class: "rig-bone" + (FAR[b] ? " rig-far" : "") }, svg);
    });
    var head = el("circle", { r: 10, class: "rig-head" }, svg);

    function draw(t01) {
      var joints = fk(poseAt(ex, t01));
      DRAW_ORDER.forEach(function (b) {
        var j = joints[b];
        lines[b].setAttribute("x1", j.start.x.toFixed(1));
        lines[b].setAttribute("y1", j.start.y.toFixed(1));
        lines[b].setAttribute("x2", j.end.x.toFixed(1));
        lines[b].setAttribute("y2", j.end.y.toFixed(1));
      });
      var neck = joints.neck;
      var dx = neck.end.x - neck.start.x, dy = neck.end.y - neck.start.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      head.setAttribute("cx", (neck.end.x + (dx / len) * 8).toFixed(1));
      head.setAttribute("cy", (neck.end.y + (dy / len) * 8).toFixed(1));
      return joints;
    }

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      draw(ex.keys[ex.still].t);
      return;
    }
    var start = null;
    function tick(now) {
      if (frozen[name] != null) { draw(frozen[name]); }
      else {
        if (start === null) start = now;
        draw(((now - start) % ex.dur) / ex.dur);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    var svgs = document.querySelectorAll("svg[data-rig]");
    for (var i = 0; i < svgs.length; i++) setup(svgs[i]);
  }

  window.RIG = {
    freeze: function (name, t) { frozen[name] = t; },
    thaw: function (name) { delete frozen[name]; },
    exercises: EXERCISES,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
