# Contributing to CyberOps Agent

Thank you for your interest in contributing! This guide covers everything you need to get started.

---

## Table of Contents

1. [Getting started](#1-getting-started)
2. [Project structure](#2-project-structure)
3. [Development workflow](#3-development-workflow)
4. [Code style](#4-code-style)
5. [Submitting a pull request](#5-submitting-a-pull-request)
6. [Reporting bugs](#6-reporting-bugs)
7. [Suggesting features](#7-suggesting-features)

---

## 1. Getting started

```bash
# Clone the repo
git clone https://github.com/mahak867/cyberops-agent.git
cd cyberops-agent

# Install dev dependencies (ESLint)
npm install
```

Load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `cyberops-agent/` directory
4. The 🛡️ icon appears in your toolbar

---

## 2. Project structure

```
cyberops-agent/
├── .github/workflows/ci.yml   # CI lint check
├── manifest.json              # Extension manifest (MV3)
├── background.js              # Service worker — scan-history persistence
├── content.js                 # Injected page scanner (threat rules R1–R4)
├── popup.html                 # Extension popup markup
├── popup.js                   # Popup controller
├── SCORING.md                 # Deterministic scoring reference + examples
├── PRIVACY_POLICY.md          # Data-handling disclosure
├── CHANGELOG.md               # Version history
└── package.json               # Dev tooling (ESLint)
```

---

## 3. Development workflow

**After editing any JS file**, reload the extension:

1. Go to `chrome://extensions`
2. Click the **↺ reload** icon on the CyberOps Agent card
3. Refresh the tab you want to test

**Run the linter** before committing:

```bash
npm run lint
```

CI runs the same lint check on every push and pull request.

---

## 4. Code style

- ES2021, `"use strict"` implied via the extension context
- No `var` — use `const` / `let`
- Semicolons required
- Strict equality (`===`) always
- All variables and parameters must be used (unused vars → warning; prefix with `_` to suppress)
- Comments use `//` for inline and `/** … */` JSDoc blocks for file headers
- Keep functions focused — one responsibility per function

These rules are enforced by ESLint (`.eslintrc.json`). Run `npm run lint` and fix all errors before opening a PR.

---

## 5. Submitting a pull request

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feat/my-improvement
   ```
2. Make your changes; keep commits small and descriptive.
3. Run `npm run lint` — the PR will fail CI if there are lint errors.
4. If you add or change a scoring rule, update `SCORING.md` (rule table + worked examples).
5. Add an entry to `CHANGELOG.md` under a new `[Unreleased]` section.
6. Open a pull request against `main` with a clear description of the change and why it's needed.

---

## 6. Reporting bugs

Open a [GitHub Issue](https://github.com/mahak867/cyberops-agent/issues) and include:

- Chrome version and OS
- Steps to reproduce
- Expected vs. actual behaviour
- Console output (right-click the extension icon → Inspect popup)

---

## 7. Suggesting features

Open a [GitHub Issue](https://github.com/mahak867/cyberops-agent/issues) with the `enhancement` label. Describe:

- The use case / problem being solved
- Your proposed approach
- Any privacy or permission implications
