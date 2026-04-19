# Changelog

All notable changes to CyberOps Agent are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [2.1.0] — 2026-04-19

### Added
- `SCORING.md` — complete deterministic scoring reference with four worked examples.
- `PRIVACY_POLICY.md` — full data-handling disclosure and per-permission justification.
- `CONTRIBUTING.md` — contributor guide (setup, code style, PR process).
- `package.json` + `.eslintrc.json` — ESLint toolchain for consistent code style.
- `.github/workflows/ci.yml` — GitHub Actions CI: lints every push and pull request.
- `background.js` now persists a rolling scan history (last 20 entries) to `chrome.storage.local`.
- `popup.html` — threats/positives list rendered below the log line after each scan.
- `manifest.json` — Content Security Policy (`script-src 'self'; object-src 'self'`).

### Fixed
- **Scoring bug**: password-field rule (R1) previously added +40 *per field* on the page;
  it now fires at most once per page (correct behaviour per the scoring spec).
- **Threshold inconsistency**: `popup.js` used `score > 70` for CRITICAL while
  `content.js` used `score >= 70`; both now use `>= 70`.
- **Score cap**: `analysis.score` is now capped at 100 before being returned, so the
  Threat Index always stays within the documented 0–100 range.
- Removed UTF-8 BOM and mojibake characters from `content.js` and `popup.js`.
- `popup.html` now declares `<meta charset="UTF-8">`.
- `SCAN_RESULT` message now carries `threats` and `positives` arrays so the popup
  can display a full forensic summary, not just a numeric score.

### Changed
- `manifest.json` description updated to accurately describe the extension
  (removed unsupported "AI/Agentic" claims).
- Version bumped to `2.1` in `manifest.json` to reflect this release.

---

## [2.0.0] — initial public release

### Added
- Manifest V3 Chrome extension scaffold.
- `content.js` DOM scanner: R1–R4 threat rules.
- `popup.html` / `popup.js` with Threat Index score display.
- `background.js` service worker stub.
- MIT License and initial README.
