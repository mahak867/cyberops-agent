<div align="center">

# 🛡️ CyberOps Agent

### Real-Time Phishing Defense & Web Forensics

[![CI](https://github.com/mahak867/cyberops-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/mahak867/cyberops-agent/actions/workflows/ci.yml)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2021-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-2.1-green?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](#license)

> Real-time threat detection, phishing analysis, and page forensics — right in your browser.

</div>

---

## ✨ What It Does

CyberOps Agent is a **Chrome browser extension** that acts as a personal security layer. It analyses the pages you visit using four deterministic rules and produces an instant **Threat Index score** (0–100) so you know the risk level before you interact with a site.

| Capability | Description |
|---|---|
| 🔍 **Deep Page Scan** | On-demand forensic analysis of the current page |
| 📊 **Threat Index** | Deterministic risk score (0–100) — see [SCORING.md](./SCORING.md) for the full rule set and worked examples |
| 🚨 **Phishing Detection** | Identifies suspicious forms, misleading links, and social-engineering language |
| 💾 **Scan History** | Service worker persists the last 20 scan results to local browser storage |
| 🖥️ **Clean UI** | Dark-themed popup with live threat list after each scan |

---

## 🖼️ Interface Preview

```
╔══════════════════════════════════════╗
║  ● CYBEROPS AGENT    System Active   ║
╠══════════════════════════════════════╣
║                                      ║
║           [ 72 ]                     ║
║         THREAT INDEX                 ║
║                                      ║
║    [  🛡️  DEEP SCAN PAGE  ]          ║
║                                      ║
║  > Scanning DOM for threats...       ║
║  > Checking domain reputation...     ║
╚══════════════════════════════════════╝
```

---

## 🏗️ Architecture

```
cyberops-agent/
├── .github/workflows/ci.yml  # CI — lint on every push/PR
├── manifest.json              # Extension config (Manifest V3)
├── background.js              # Service worker — scan-history persistence
├── content.js                 # Injected into every page for DOM analysis
├── popup.html                 # Extension popup UI
├── popup.js                   # Popup logic & scan orchestration
└── package.json               # Dev tooling (ESLint)
```

### How It Works

```
  Browser Tab
      │
      ▼
  content.js  ──────────►  background.js (service worker)
  (DOM scan)                    │
      │                         │  analysis
      └──────────►  popup.js ◄──┘
                     │
                     ▼
                 Threat Index
```

1. **`content.js`** is injected into every page — it reads the DOM, links, forms, and visible text
2. **`background.js`** runs as a persistent service worker, persisting scan history via `chrome.storage.local`
3. **`popup.js`** triggers deep scans on demand and renders the threat score and findings in the UI

---

## 🚀 Installation

> CyberOps Agent is loaded as an **unpacked extension** for development. No Chrome Web Store listing required.

### Prerequisites

- Google Chrome (or any Chromium-based browser)
- Developer Mode enabled in `chrome://extensions`

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/mahak867/cyberops-agent.git
```

Then in Chrome:

1. Open **`chrome://extensions`**
2. Toggle **Developer mode** ON (top-right)
3. Click **"Load unpacked"**
4. Select the cloned `cyberops-agent/` folder
5. The 🛡️ icon appears in your toolbar — you're live

---

## 🔒 Permissions Explained

CyberOps Agent requests only what it needs. For the full per-permission justification and a description of what data is and is not collected, see the [Privacy Policy](./PRIVACY_POLICY.md).

| Permission | Why It's Needed |
|---|---|
| `activeTab` | Identify the currently active tab so the scan targets the page you are viewing |
| `scripting` | Send the `RUN_SCAN` message to `content.js` running in the active tab |
| `storage` | Persist the rolling scan history (last 20 results) locally in the browser |
| `tabs` | Monitor tab events in `background.js` for scan-history attribution |

> **No data is sent to external servers.** All analysis runs locally in your browser.

---

## 🛠️ Development

### Setup

```bash
npm install   # installs ESLint dev dependency
npm run lint  # lint all JS files
```

### Reloading After Changes

Since this is an unpacked extension, after editing any file:

1. Go to `chrome://extensions`
2. Click the **↺ reload** icon on the CyberOps Agent card
3. Refresh the tab you want to scan

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full development guide and PR process.

---

## 📊 Threat Scoring

The Threat Index is built from **four deterministic rules** — no machine learning, no black box.

| Rule | Points |
|---|:---:|
| Password field on a non-HTTPS page | +40 |
| Form submits to a cross-origin host | +50 |
| Social-engineering phrase in page text (per phrase) | +20 |
| Misleading link (display text shows a domain ≠ actual href host) | +30 |

**Thresholds:** 0 = clean · 1–69 = amber warning · 70+ = full quarantine overlay.

See **[SCORING.md](./SCORING.md)** for the complete rule reference, the full list of recognised phrases, and four worked examples showing exactly why a page receives its score.

---

## 🗺️ Roadmap

- [ ] ML-based URL reputation scoring
- [ ] Integration with threat intelligence APIs (VirusTotal, etc.)
- [x] Scan history persistence (stored locally via `chrome.storage.local`)
- [ ] Scan history dashboard UI
- [ ] Firefox / Edge support
- [ ] Export forensic reports as PDF

---

## ⚠️ Disclaimer

CyberOps Agent is built for **educational and personal security research** purposes. It is not a replacement for enterprise-grade security software. Always exercise caution on unfamiliar websites.

---

## 📄 License

This project is licensed under the MIT License — free to use, modify, and distribute.

---

<div align="center">

Built with 🛡️ by [mahak867](https://github.com/mahak867)

</div>
