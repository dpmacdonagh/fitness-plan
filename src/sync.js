// Cross-device sync via a file in this repo: data/state.json on the
// `app-state` branch (that branch never triggers a deploy). Reads are
// unauthenticated (public repo, raw URL). Writes need a fine-grained
// GitHub token scoped to this one repo with Contents read/write —
// pasted once per device in Progress → Sync.

const OWNER = "dpmacdonagh";
const REPO = "fitness-plan";
const BRANCH = "app-state";
const PATH = "data/state.json";
const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${PATH}`;
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

const SYNCED_FIELDS = ["done", "weights", "pantry", "shopChecked", "mealChoice"];

export function pickSynced(state) {
  const doc = {};
  for (const f of SYNCED_FIELDS) doc[f] = state[f];
  doc.updatedAt = state.updatedAt || 0;
  return doc;
}

// Merge a remote doc into local state. Union weights by date (local wins a
// same-date conflict only if local is newer); OR-merge done; newer doc wins
// the object fields wholesale.
export function mergeDocs(local, remote) {
  if (!remote) return local;
  const localNewer = (local.updatedAt || 0) >= (remote.updatedAt || 0);
  const base = localNewer ? remote : local;
  const top = localNewer ? local : remote;

  const weights = {};
  for (const w of [...(base.weights || []), ...(top.weights || [])]) weights[w.date] = w.lbs;
  const done = { ...(local.done || {}) };
  for (const [k, v] of Object.entries(remote.done || {})) if (v) done[k] = true;

  return {
    ...base,
    ...top,
    done,
    weights: Object.keys(weights).sort().map((date) => ({ date, lbs: weights[date] })),
    updatedAt: Math.max(local.updatedAt || 0, remote.updatedAt || 0),
  };
}

export async function fetchRemote() {
  try {
    const res = await fetch(`${RAW}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function fetchSha(token) {
  const res = await fetch(`${API}?ref=${BRANCH}&t=${Date.now()}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  return (await res.json()).sha;
}

// btoa that survives unicode
function b64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export async function pushRemote(token, doc) {
  const body = {
    message: "app: sync state",
    branch: BRANCH,
    content: b64(JSON.stringify(doc, null, 2) + "\n"),
  };
  const sha = await fetchSha(token);
  if (sha) body.sha = sha;
  const res = await fetch(API, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify(body),
  });
  if (res.status === 409 || res.status === 422) return { conflict: true };
  if (!res.ok) throw new Error(`GitHub write failed (${res.status})`);
  return { ok: true };
}
