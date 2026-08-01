// ==UserScript==
// @name         Send to Agent Inbox
// @namespace    https://github.com/OGZamasu/agent-inbox
// @version      1.0.0
// @description  Send the page you're reading to your Agent Inbox, from any site.
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      *
// @run-at       document-idle
// @noframes
// @downloadURL  https://raw.githubusercontent.com/OGZamasu/agent-inbox/main/userscript/agent-inbox.user.js
// @updateURL    https://raw.githubusercontent.com/OGZamasu/agent-inbox/main/userscript/agent-inbox.user.js
// ==/UserScript==

/*
 * Why this exists alongside the Chrome extension:
 *
 * Chrome has not allowed installing an extension from anywhere but the Web Store
 * since Chrome 33 on Windows and Chrome 44 on macOS, so shipping the extension
 * without review means asking people to enable Developer mode and load it
 * unpacked. A userscript sidesteps that entirely — the userscript manager is the
 * reviewed extension, and scripts install from a URL in one click.
 *
 * The important part is GM_xmlhttpRequest. It runs in the manager's context, not
 * the page's, so it is not bound by the page's Content-Security-Policy. That is
 * the exact thing that stops a plain bookmarklet from working on GitHub and X.
 */

(function () {
  "use strict";

  // Greasemonkey 4 exposes the promise-based GM.* API instead of GM_*.
  const GM_API = typeof GM !== "undefined" ? GM : null;
  const getValue = (k, d) =>
    typeof GM_getValue === "function" ? Promise.resolve(GM_getValue(k, d)) : GM_API.getValue(k, d);
  const setValue = (k, v) =>
    typeof GM_setValue === "function" ? Promise.resolve(GM_setValue(k, v)) : GM_API.setValue(k, v);
  const request = (opts) =>
    typeof GM_xmlhttpRequest === "function" ? GM_xmlhttpRequest(opts) : GM_API.xmlHttpRequest(opts);
  const registerMenu = (label, fn) => {
    if (typeof GM_registerMenuCommand === "function") GM_registerMenuCommand(label, fn);
    else if (GM_API && GM_API.registerMenuCommand) GM_API.registerMenuCommand(label, fn);
  };

  function toast(text, good) {
    // A native notification is nicer, but it's not available in every manager.
    try {
      if (typeof GM_notification === "function") {
        GM_notification({ title: "Agent Inbox", text, timeout: 2500 });
        return;
      }
    } catch {}
    banner(text, good);
  }

  function banner(text, good) {
    const el = document.createElement("div");
    el.textContent = text;
    el.style.cssText = [
      "position:fixed", "z-index:2147483647", "top:16px", "right:16px",
      "padding:12px 18px", "border-radius:10px",
      "font:600 15px/1.3 -apple-system,BlinkMacSystemFont,system-ui,sans-serif",
      `background:${good ? "#166534" : "#991b1b"}`, "color:#fff",
      "box-shadow:0 6px 20px rgba(0,0,0,.28)", "pointer-events:none",
    ].join(";");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  async function settings(force) {
    let base = await getValue("base", "");
    let key = await getValue("key", "");

    if (force || !base || !key) {
      const b = window.prompt(
        "Your Agent Inbox address\n(e.g. https://agent-inbox.you.workers.dev)",
        base || "https://"
      );
      if (b === null) return null;
      const k = window.prompt("Your secret key\n(find it on your inbox's Set up page)", key || "");
      if (k === null) return null;

      base = String(b).trim().replace(/\/+$/, "");
      key = String(k).trim();
      if (!/^https:\/\/.+/i.test(base) || !key) {
        toast("That didn't look right — try again.", false);
        return null;
      }
      await setValue("base", base);
      await setValue("key", key);
      toast("Saved. Alt+Shift+S sends a page.", true);
    }
    return { base, key };
  }

  async function send() {
    const cfg = await settings(false);
    if (!cfg) return;

    // If you've highlighted something, keep it as the note.
    const selection = String(window.getSelection() || "").trim().slice(0, 2000);

    request({
      method: "POST",
      url: `${cfg.base}/api/add`,
      headers: { "Content-Type": "application/json", "X-Inbox-Key": cfg.key },
      data: JSON.stringify({
        url: location.href,
        note: selection,
        source: "userscript",
      }),
      onload: (res) => {
        if (res.status >= 200 && res.status < 300) toast("Sent to your inbox", true);
        else if (res.status === 401) toast("Key rejected — reopen settings", false);
        else toast(`Inbox error (${res.status})`, false);
      },
      onerror: () => toast("Couldn't reach your inbox", false),
      ontimeout: () => toast("Inbox timed out", false),
      timeout: 12000,
    });
  }

  registerMenu("Send this page to my inbox", send);
  registerMenu("Agent Inbox settings…", () => settings(true));

  window.addEventListener(
    "keydown",
    (e) => {
      // Alt+Shift+S — matches the Chrome extension's shortcut.
      if (e.altKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        send();
      }
    },
    true
  );
})();
