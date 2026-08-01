# Setup

One time only. Step 1 takes about a minute and is enough on its own.

Throughout, **your inbox address** is the URL you deployed to — something like
`https://agent-inbox.yourname.workers.dev`. Your **passcode** and **secret key** were shown once
when you pressed *Create my inbox*.

Lost them? Reset from the command line:

```bash
npx wrangler secret put INBOX_PASSCODE
```

---

## Step 1 · Get in, on every device you use

1. Open your inbox address
2. Type your passcode and press **Unlock**

That device stays unlocked for a year. You won't be asked again.

You can already send things — open it, paste a link, press **Send to inbox**. Everything below
just makes it faster.

> Your inbox also has a magic link (`https://your-inbox/?k=YOUR-KEY`) that unlocks automatically.
> Bookmark it and you never type the passcode. Keep it private — anyone with that link is in.

---

## Step 2 · Android

Install the page as an app. Android then lists **Agent Inbox** in the share menu, so you can send
things straight from Reddit, X, or anywhere else without leaving what you're reading.

1. Open your inbox in **Chrome** (or Samsung Internet). It has to be the real browser, not one
   embedded inside another app — if you tapped a link from inside some app, use the **⋮** menu
   and choose **Open in Chrome** first.
2. Tap the **⋮** menu, top right
3. Tap **Install app** (Samsung Internet calls it **Add page to → Home screen**)
4. Confirm with **Install**

**To use it:** in any app, tap **Share**, then **Agent Inbox**. Green check, done.

### If "Agent Inbox" isn't in the share menu

Nearly always it got saved as a plain bookmark rather than installed — a bookmark doesn't
register as a share target. Delete the home screen icon and redo it, making sure you tap
**Install app** and not *Add to Home screen* if Chrome offers both.

Some share menus also hide new targets behind a **More** button the first time. Once you've used
it a couple of times Android promotes it up the list.

---

## Step 3 · Desktop browser

### The Chrome extension (recommended)

Works on every site, including ones with strict security policies.

1. Download the repo — on GitHub, **Code → Download ZIP** — and unzip it
2. Go to `chrome://extensions` and turn on **Developer mode** (top right)
3. Click **Load unpacked** and choose the `extension` folder
4. Click the extension's **Details → Extension options**
5. Paste your inbox address and secret key, then press **Save and test**

Both values are on your inbox's `/setup` page, each with a copy button.

Chrome will ask permission to talk to your inbox address — that's access to that one site only.

Now click the toolbar icon to send the current page, right-click a link to send just that link,
or press <kbd>Alt</kbd><kbd>Shift</kbd><kbd>S</kbd>.

### Or a bookmarklet, if you'd rather not install anything

Your inbox's `/setup` page has a ready-made bookmarklet with a copy button.

1. Press <kbd>⇧</kbd><kbd>⌘</kbd><kbd>B</kbd> (or <kbd>Ctrl</kbd><kbd>Shift</kbd><kbd>B</kbd>) to
   show the bookmarks bar
2. Copy the long `javascript:...` line from `/setup`
3. Right-click the bookmarks bar → **Add Page…**
4. Name it **Send to inbox**, and paste that line into the **address** field — not the name field

Clicking it opens a small window that closes itself. If your browser blocks the pop-up it quietly
uses the current tab instead and bounces straight back.

The line is long and looks strange because it's a small program, not a web address — and it
contains your secret key, so don't paste it anywhere public.

---

## Step 4 · iPhone or iPad

iOS has no equivalent of Android's install-as-share-target, so this uses the Shortcuts app. Open
`/setup` on the device itself — it has copy buttons for every value, so you never hand-type the
key. Four short steps and **Send to inbox** appears in the Share menu everywhere.

---

## Step 5 · Connect an agent

See [AGENTS.md](AGENTS.md) — Claude Code, ChatGPT, MCP clients, or anything that speaks HTTP.

---

## If something goes wrong

**"That passcode didn't work"** — it's all lowercase with the dashes. After 8 wrong tries it
locks out for 15 minutes.

**Sharing from the phone opens a login screen** — the installed app lost its session. Open the
app, unlock with the passcode once, and sharing works again.

**The extension shows a red `!`** — usually the key. Reopen its options and press **Save and
test**; it will tell you whether the address or the key is the problem.

**You sent something but your agent says the inbox is empty** — check the web page. If the item
isn't under *Waiting* it never arrived, so the problem is the sending step, not the agent.

**The very first page load after deploying shows an error** — wait a minute and refresh.
Cloudflare needs a moment to finish connecting your database, and can briefly show
`error code 1042` until it does.

**Changes to the Worker don't seem to take effect** — Cloudflare's edge can lag a minute or so
behind a deploy, and it may serve old and new versions inconsistently while it catches up. Wait
it out rather than deploying again.
