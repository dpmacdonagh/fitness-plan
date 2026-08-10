// Exercise library. Rig poses are world-space joint angles per keyframe
// (0° = right, 90° = down, -90° = up; y down, ground at y = 0) —
// screenshot-verified. Cues are the coaching text shown beside each demo.

export const BONES = {
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
export const FAR = { uarmF: 1, farmF: 1, thighF: 1, shinF: 1, footF: 1 };
export const DRAW_ORDER = [
  "uarmF", "farmF", "thighF", "shinF", "footF",
  "torso", "thighN", "shinN", "footN", "neck", "uarmN", "farmN",
];

export const EXERCISES = {
  "curl-up": {
    name: "Curl-up (McGill)",
    summary: "Abs without bending the spine — the lift is tiny.",
    cues: [
      "One knee bent, one leg straight; hands under the low back to preserve its arch.",
      "Lift head and shoulders as one unit, a few centimeters — like taking your head's weight off a scale.",
      "No chin poke, no crunch. If the low back moves, you went too high.",
      "Hold ~8 s, breathe normally, lower slow. Swap legs halfway.",
    ],
    caution: "This replaces all crunches/sit-ups — loaded spinal flexion is permanently off the menu (rule 1).",
    dur: 5600, view: [-115, -70, 230, 90], still: 1, props: [{ ground: true }],
    keys: [
      { t: 0.0, root: [0, -11], a: { torso: 180, neck: 180, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
      { t: 0.2, root: [0, -11], a: { torso: 186, neck: 186, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
      { t: 0.75, root: [0, -11], a: { torso: 186, neck: 186, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
      { t: 1.0, root: [0, -11], a: { torso: 180, neck: 180, uarmF: 22, farmF: 2, uarmN: 18, farmN: 0, thighF: -3, shinF: 3, footF: -70, thighN: -52, shinN: 96, footN: 10 } },
    ],
  },
  "side-plank": {
    name: "Side plank (from knees)",
    summary: "Elbow under shoulder, hips drive up to a straight line.",
    cues: [
      "Prop on the forearm, elbow directly under the shoulder — stacked, not pressing.",
      "Knees bent ~90°, one on top of the other.",
      "Drive hips up until shoulder–hip–knee is one straight line; don't sag or roll.",
      "Hold, breathe, lower with control. Both sides.",
    ],
    caution: "Left side down = supported on the left forearm; stacked is allowed, but if the pec-to-elbow line lights up, the set ends immediately (rule 2).",
    dur: 5000, view: [-120, -65, 225, 85], still: 1, props: [{ ground: true }],
    keys: [
      { t: 0.0, root: [1, -4], a: { torso: -24, neck: -18, uarmF: 158, farmF: 162, uarmN: 92, farmN: 0, thighF: 175, shinF: 178, footF: 181, thighN: 179, shinN: 181, footN: 184 } },
      { t: 0.32, root: [-2, -20], a: { torso: -7, neck: -6, uarmF: 168, farmF: 172, uarmN: 98, farmN: 0, thighF: 156, shinF: 176, footF: 180, thighN: 160, shinN: 178, footN: 182 } },
      { t: 0.7, root: [-2, -20], a: { torso: -7, neck: -6, uarmF: 168, farmF: 172, uarmN: 98, farmN: 0, thighF: 156, shinF: 176, footF: 180, thighN: 160, shinN: 178, footN: 182 } },
      { t: 1.0, root: [1, -4], a: { torso: -24, neck: -18, uarmF: 158, farmF: 162, uarmN: 92, farmN: 0, thighF: 175, shinF: 178, footF: 181, thighN: 179, shinN: 181, footN: 184 } },
    ],
  },
  "bird-dog": {
    name: "Bird dog",
    summary: "Opposite arm and leg reach out; the back stays table-flat.",
    cues: [
      "Hands under shoulders, knees under hips, back flat like a table.",
      "Reach one arm forward and the opposite leg back, both to horizontal.",
      "Nothing tips or twists — imagine a cup of coffee balanced on the low back.",
      "Hold a few seconds, return with control, switch sides.",
    ],
    caution: "The reaching arm is unloaded, so extension is fine here. If the left arm complains, reach less far or extend the leg only.",
    dur: 6000, view: [-125, -95, 235, 115], still: 1, props: [{ ground: true }],
    keys: [
      { t: 0.0, root: [0, -46], a: { torso: -3, neck: 8, uarmF: 114, farmF: 63, uarmN: 111, farmN: 60, thighF: 96, shinF: 177, footF: 183, thighN: 100, shinN: 178, footN: 182 } },
      { t: 0.3, root: [0, -46], a: { torso: -3, neck: 4, uarmF: -6, farmF: -3, uarmN: 111, farmN: 60, thighF: 184, shinF: 179, footF: 186, thighN: 100, shinN: 178, footN: 182 } },
      { t: 0.72, root: [0, -46], a: { torso: -3, neck: 4, uarmF: -6, farmF: -3, uarmN: 111, farmN: 60, thighF: 184, shinF: 179, footF: 186, thighN: 100, shinN: 178, footN: 182 } },
      { t: 1.0, root: [0, -46], a: { torso: -3, neck: 8, uarmF: 114, farmF: 63, uarmN: 111, farmN: 60, thighF: 96, shinF: 177, footF: 183, thighN: 100, shinN: 178, footN: 182 } },
    ],
  },
  "glute-bridge": {
    name: "Glute bridge",
    summary: "Squeeze up to a straight shoulder–hip–knee line. Stop there.",
    cues: [
      "On your back, knees bent, feet flat hip-width, arms relaxed.",
      "Squeeze glutes, push through heels, lift to a straight line.",
      "Stop at straight — higher just cranks the low back.",
      "Pause a second up top, lower with control.",
    ],
    caution: "The hips/hamstrings staple (rule 4). Stop each set 3–4 reps short of grinding.",
    dur: 4200, view: [-110, -80, 205, 100], still: 1, props: [{ ground: true }],
    keys: [
      { t: 0.0, root: [0, -10], a: { torso: 180, neck: 180, uarmF: 25, farmF: 5, uarmN: 22, farmN: 2, thighF: -50, shinF: 97, footF: 12, thighN: -54, shinN: 95, footN: 10 } },
      { t: 0.38, root: [0, -26], a: { torso: 164, neck: 170, uarmF: 32, farmF: 8, uarmN: 30, farmN: 5, thighF: -17, shinF: 118, footF: 12, thighN: -19, shinN: 117, footN: 10 } },
      { t: 0.62, root: [0, -26], a: { torso: 164, neck: 170, uarmF: 32, farmF: 8, uarmN: 30, farmN: 5, thighF: -17, shinF: 118, footF: 12, thighN: -19, shinN: 117, footN: 10 } },
      { t: 1.0, root: [0, -10], a: { torso: 180, neck: 180, uarmF: 25, farmF: 5, uarmN: 22, farmN: 2, thighF: -50, shinF: 97, footF: 12, thighN: -54, shinN: 95, footN: 10 } },
    ],
  },
  "incline-pushup": {
    name: "Incline push-up",
    summary: "Body rigid head-to-heels; chest to the counter, press away.",
    cues: [
      "Hands on a sturdy counter, slightly wider than shoulders.",
      "Walk feet back until the body is one straight line. Brace like a plank.",
      "Lower chest to the surface, elbows ~45° from the body, press back up.",
      "Steeper incline = lighter load. In doubt, go steeper.",
    ],
    caution: "Left arm rules apply hard (rule 2): keep the press close, no hard lockout, and the instant the pec-to-elbow line lights up, the set is over.",
    dur: 3600, view: [-45, -145, 250, 160], still: 2, props: [{ ground: true }, { rect: [136, -68, 54, 68] }],
    keys: [
      { t: 0.0, root: [61.5, -65.5], a: { torso: -45, neck: -45, uarmF: 47, farmF: 47, uarmN: 45, farmN: 45, thighF: 137, shinF: 137, footF: 6, thighN: 135, shinN: 135, footN: 3 } },
      { t: 0.45, root: [55.6, -55.9], a: { torso: -41, neck: -41, uarmF: 79, farmF: 8, uarmN: 77, farmN: 6, thighF: 141, shinF: 141, footF: 6, thighN: 139, shinN: 139, footN: 3 } },
      { t: 0.6, root: [55.6, -55.9], a: { torso: -41, neck: -41, uarmF: 79, farmF: 8, uarmN: 77, farmN: 6, thighF: 141, shinF: 141, footF: 6, thighN: 139, shinN: 139, footN: 3 } },
      { t: 1.0, root: [61.5, -65.5], a: { torso: -45, neck: -45, uarmF: 47, farmF: 47, uarmN: 45, farmN: 45, thighF: 137, shinF: 137, footF: 6, thighN: 135, shinN: 135, footN: 3 } },
    ],
  },
  "chair-squat": {
    name: "Chair-assisted squat",
    summary: "Hips back first, tap the chair, drive up through the heels.",
    cues: [
      "Feet shoulder-width, sturdy chair behind you.",
      "Hips reach back first — like sitting down — then knees bend. Arms out as counterweight.",
      "Tap the chair, don't plop. A failing rep just becomes sitting down — that's the safety net.",
      "Stand by driving through heels and squeezing glutes. Chest up, back neutral.",
    ],
    caution: "Torso leans forward naturally, but the back never rounds (rule 1).",
    dur: 4400, view: [-85, -192, 145, 207], still: 1,
    props: [{ ground: true }, { rect: [-62, -52, 40, 52] }, { rect: [-68, -108, 8, 108] }],
    keys: [
      { t: 0.0, root: [6, -91], a: { torso: -87, neck: -87, uarmF: 95, farmF: 95, uarmN: 92, farmN: 92, thighF: 92, shinF: 92, footF: 7, thighN: 89, shinN: 89, footN: 5 } },
      { t: 0.42, root: [-16, -56], a: { torso: -60, neck: -62, uarmF: 10, farmF: 7, uarmN: 8, farmN: 5, thighF: 24, shinF: 121, footF: 7, thighN: 21, shinN: 118, footN: 5 } },
      { t: 0.58, root: [-16, -56], a: { torso: -60, neck: -62, uarmF: 10, farmF: 7, uarmN: 8, farmN: 5, thighF: 24, shinF: 121, footF: 7, thighN: 21, shinN: 118, footN: 5 } },
      { t: 1.0, root: [6, -91], a: { torso: -87, neck: -87, uarmF: 95, farmF: 95, uarmN: 92, farmN: 92, thighF: 92, shinF: 92, footF: 7, thighN: 89, shinN: 89, footN: 5 } },
    ],
  },
};

export const RULES = [
  {
    title: "1 · Spine (disc surgery history)",
    lines: [
      "No free-weight barbell work. Nothing that compresses the spine.",
      "Core work is isometric only — the McGill Big 3: curl-up, side plank, bird dog.",
      "No loaded spinal flexion. Ever.",
    ],
  },
  {
    title: "2 · Left arm",
    lines: [
      "Never load the left arm in an extended position — no pressing or carrying away from the body with straight elbows.",
      "If the pec-to-elbow line lights up, the set ends immediately.",
      "Dumbbells start at 5–10 lb, increase only after two symptom-free weeks.",
    ],
  },
  {
    title: "3 · Skin",
    lines: [
      "Compression shorts + anti-chafe balm for every cardio session.",
      "Shower immediately after sweating; benzoyl peroxide 10% wash Mon/Wed/Fri; loose breathable clothes the rest of the day.",
      "Active boil = that friction zone is closed. Walk or train around it. Never squeeze; warm compresses only.",
      "Fever, red streaks, or fast growth = urgent care. No exceptions.",
    ],
  },
  {
    title: "4 · Hips & hamstrings",
    lines: [
      "Ramp slowly. Stop sets 3–4 reps short of failure.",
      "Glute bridges are the staple.",
    ],
  },
];
