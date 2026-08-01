/**
 * Agent Inbox — Chrome extension service worker.
 *
 * Why an extension when a bookmarklet exists: a bookmarklet's code runs INSIDE
 * the page and obeys that page's Content-Security-Policy. GitHub and X both set
 * connect-src, which kills the request before it leaves the browser. Extension
 * code runs in its own context with its own host permissions, so no site policy
 * can interfere.
 */

const MENU_LINK = "agent-inbox-link";
const MENU_PAGE = "agent-inbox-page";
const MENU_SELECTION = "agent-inbox-selection";

async function config() {
  const c = await chrome.storage.local.get(["base", "key"]);
  return { base: (c.base || "").replace(/\/+$/, ""), key: c.key || "" };
}

function badge(text, color) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
  setTimeout(() => chrome.action.setBadgeText({ text: "" }), 2500);
}

async function send(payload) {
  const { base, key } = await config();

  if (!base || !key) {
    badge("set", "#b45309");
    chrome.runtime.openOptionsPage();
    return;
  }

  try {
    const res = await fetch(`${base}/api/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Inbox-Key": key },
      body: JSON.stringify({ source: "chrome extension", ...payload }),
    });
    badge(res.ok ? "✓" : "!", res.ok ? "#166534" : "#b91c1c");
    if (!res.ok && res.status === 401) chrome.runtime.openOptionsPage();
  } catch {
    // Usually means host permission was never granted for this inbox origin.
    badge("!", "#b91c1c");
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_LINK,
    title: "Send link to my inbox",
    contexts: ["link"],
  });
  chrome.contextMenus.create({
    id: MENU_PAGE,
    title: "Send this page to my inbox",
    contexts: ["page"],
  });
  chrome.contextMenus.create({
    id: MENU_SELECTION,
    title: "Send selection to my inbox",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_LINK && info.linkUrl) {
    send({ url: info.linkUrl, note: tab?.title || "" });
  } else if (info.menuItemId === MENU_SELECTION && info.selectionText) {
    // Keep the page URL as the item and the quoted text as the note.
    send({ url: info.pageUrl || tab?.url || "", note: info.selectionText.slice(0, 2000) });
  } else if (info.pageUrl || tab?.url) {
    send({ url: info.pageUrl || tab.url });
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab?.url) send({ url: tab.url });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "send-page") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) send({ url: tab.url });
});
