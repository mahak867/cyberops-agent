<div align="center">

# 🛡️ CyberOps Agent

### AI-Powered Phishing Defense & Web Forensics

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=flat-square&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/Version-2.0-green?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](#license)

> Real-time threat detection, phishing analysis, and page forensics — right in your browser.

</div>

---

## ✨ What It Does

CyberOps Agent is a **Chrome browser extension** that acts as your personal AI security layer. It continuously monitors the pages you visit and gives you an instant **Threat Index score** so you always know how dangerous a site is before you interact with it.

| Capability | Description |
|---|---|
| 🔍 **Deep Page Scan** | On-demand forensic analysis of the current page |
| 📊 **Threat Index** | Real-time risk score (0–100) for every site you visit |
| 🚨 **Phishing Detection** | Identifies suspicious patterns, domains, and form behaviour |
| ⚡ **Background Monitoring** | Service worker silently watches all tabs in real time |
| 🖥️ **Clean UI** | Dark-themed popup with live console output |

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
├── manifest.json      # Extension config (Manifest V3)
├── background.js      # Service worker — persistent monitoring
├── content.js         # Injected into every page for DOM analysis
├── popup.html         # Extension popup UI
└── popup.js           # Popup logic & scan orchestration
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

1. **`content.js`** is injected into every page — it reads the DOM, links, forms, and scripts
2. **`background.js`** runs as a persistent service worker, aggregating signals across tabs
3. **`popup.js`** triggers deep scans on demand and renders the threat score in the UI

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

CyberOps Agent requests only what it needs:

| Permission | Why It's Needed |
|---|---|
| `activeTab` | Read the content of the currently active tab for scanning |
| `scripting` | Inject `content.js` to analyse page DOM |
| `storage` | Persist scan history and settings locally |
| `tabs` | Monitor tab events for background threat tracking |

> **No data is sent to external servers.** All analysis runs locally in your browser.

---

## 🛠️ Development

### Reloading After Changes

Since this is an unpacked extension, after editing any file:

1. Go to `chrome://extensions`
2. Click the **↺ reload** icon on the CyberOps Agent card
3. Refresh the tab you want to scan

### File Reference

```js
// background.js  — add persistent monitoring logic here
// content.js     — add DOM analysis & page signal extraction here
// popup.js       — add UI interactions & scan triggers here
```

---

## 🗺️ Roadmap

- [ ] ML-based URL reputation scoring
- [ ] Integration with threat intelligence APIs (VirusTotal, etc.)
- [ ] Scan history dashboard
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
