# 🔒 Privacy Policy — CyberOps Agent

**Last updated:** April 2026

---

## 1. Overview

CyberOps Agent ("the Extension") is a Chrome browser extension that performs real-time threat analysis of web pages you visit. This policy explains exactly what data the Extension reads, what it does with that data, and what it never does.

---

## 2. Data Collected and Processed

### 2.1 Page content (read-only, never stored externally)

When you click **Deep Scan Page**, the Extension reads the following from the active tab:

| Data read | Purpose |
|---|---|
| Page URL (protocol and hostname) | Determine whether the page uses HTTPS (Rule R1) |
| DOM — `<form>` elements and their `action` attributes | Detect cross-origin form submissions (Rule R2) |
| Visible page text (`document.body.innerText`) | Detect social-engineering phrases (Rule R3) |
| DOM — `<a>` elements and their `href` attributes | Detect misleading links (Rule R4) |

**This data is analysed locally, in your browser, in memory only. It is never transmitted to any server, database, or third party.**

### 2.2 Scan score and history (stored locally in your browser)

The numeric threat score, the list of triggered threats, and the page URL are saved to `chrome.storage.local` by `background.js` after each scan. Only the last 20 scan entries are retained; older entries are automatically dropped. This data never leaves your device.

---

## 3. Data NOT Collected

The Extension does **not** collect, store, or transmit:

- Your browsing history
- Passwords or form values you type
- Cookies or authentication tokens
- Personal identifiers (name, email, IP address)
- Any data to external servers or APIs

---

## 4. Permissions Justification

The Extension requests the following Chrome permissions. Each permission is required for a specific feature; no permission is requested for future or speculative use.

| Permission | Why it is required |
|---|---|
| `activeTab` | Allows the popup to identify the currently active tab so the scan targets the page you are viewing right now. Without this permission the Extension cannot know which tab to analyse. |
| `scripting` | Allows `popup.js` to send a `RUN_SCAN` message to the `content.js` script already running in the active tab. Required for Manifest V3 tab-to-extension messaging. |
| `storage` | Persists the rolling scan history (last 20 entries: URL, score, threats, timestamp) to `chrome.storage.local`. Data stays in your browser and is never transmitted externally. |
| `tabs` | Allows `background.js` (the service worker) to listen to tab lifecycle events for background monitoring. Only tab ID and URL metadata are used; no tab content is accessed passively. |

### Host permissions (`http://*/*`, `https://*/*`)

The Extension injects `content.js` into every HTTP and HTTPS page so that it is ready to perform a DOM scan when you request one. The script is **passive** until you click Deep Scan Page — it does not read or transmit any page content automatically.

---

## 5. Third-Party Services

CyberOps Agent **does not** communicate with any third-party service. No analytics, crash-reporting, or ad networks are included. The planned VirusTotal integration listed in the roadmap is not yet implemented; this policy will be updated before any such feature ships.

---

## 6. Children's Privacy

The Extension does not knowingly collect any information from children under the age of 13.

---

## 7. Changes to This Policy

If this policy is updated, the "Last updated" date at the top of this document will change. Significant changes will also be noted in the repository changelog.

---

## 8. Contact

For questions or concerns about this privacy policy, please open an issue at:  
<https://github.com/mahak867/cyberops-agent/issues>
