const $ = (id) => document.getElementById(id);

function show(kind, msg) {
  const el = $("status");
  el.className = kind;
  el.textContent = msg;
}

async function load() {
  const c = await chrome.storage.local.get(["base", "key"]);
  $("base").value = c.base || "";
  $("key").value = c.key || "";
}

$("save").addEventListener("click", async () => {
  const base = $("base").value.trim().replace(/\/+$/, "");
  const key = $("key").value.trim();

  if (!base || !key) return show("bad", "Fill in both boxes first.");

  let origin;
  try {
    const u = new URL(base);
    if (u.protocol !== "https:") return show("bad", "The address needs to start with https://");
    origin = `${u.origin}/*`;
  } catch {
    return show("bad", "That doesn't look like a web address.");
  }

  // Ask for access to this one site only. Must happen inside a click handler,
  // which is why this lives here and not in the service worker.
  const granted = await chrome.permissions.request({ origins: [origin] });
  if (!granted) return show("bad", "Chrome needs permission to reach your inbox. Try again and choose Allow.");

  show("ok", "Checking…");
  try {
    const res = await fetch(`${base}/api/pending`, { headers: { "X-Inbox-Key": key } });
    if (res.status === 401) return show("bad", "That key was rejected. Copy it again from your inbox's Set up page.");
    if (!res.ok) return show("bad", `Your inbox answered with an error (${res.status}).`);

    const data = await res.json();
    await chrome.storage.local.set({ base, key });
    const n = data.count ?? 0;
    show("ok", `Connected. ${n === 0 ? "Nothing waiting right now." : n === 1 ? "1 item waiting." : `${n} items waiting.`} You're all set — click the toolbar icon on any page to send it.`);
  } catch {
    show("bad", "Couldn't reach that address. Check it and try again.");
  }
});

load();
