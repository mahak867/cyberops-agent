# 📊 CyberOps Agent — Threat Scoring Reference

This document describes every rule that contributes to the **Threat Index** score (0–100+), along with concrete worked examples so you can predict and verify a site's score.

---

## Scoring Rules

All rules are evaluated by `performDeepScan()` in [`content.js`](./content.js). Each rule adds a fixed number of points to the score. Rules are **additive** — the final score is the sum of all triggered rules.

| # | Rule | Points added | Code location |
|---|------|:---:|---|
| R1 | Password field present on a non-HTTPS page | **+40** | `content.js` — password field check |
| R2 | Form submits to a cross-origin host | **+50** | `content.js` — cross-origin form check |
| R3 | Social-engineering phrase found in page text | **+20** (per phrase) | `content.js` — urgency phrase list |
| R4 | Misleading link (visible text shows a domain that differs from `href` host) | **+30** (per link) | `content.js` — misleading link check |

### Recognised social-engineering phrases (R3)

Each phrase below triggers **+20 points** independently if it appears (case-insensitive) anywhere in the visible page text:

1. `verify your identity`
2. `account locked`
3. `unauthorized login`
4. `immediate action required`
5. `security alert`
6. `urgent`
7. `your account will be suspended`
8. `click here to confirm`
9. `unusual activity`
10. `limited time`
11. `act now`

---

## Score Thresholds

| Score | Severity | UI Response |
|:---:|---|---|
| **0** | Clean | No alert; green positives shown in popup |
| **1 – 69** | Warning | Amber banner pinned to top of page |
| **70+** | Critical | Full-page quarantine overlay; dangerous elements highlighted in red |

---

## Worked Examples

### Example 1 — Clean site (`https://example.com`)

| Rule | Triggered? | Points |
|------|:---:|:---:|
| R1 — password field on HTTP | No (HTTPS) | 0 |
| R2 — cross-origin form | No | 0 |
| R3 — social-engineering phrase | No | 0 |
| R4 — misleading link | No | 0 |
| **Total** | | **0** |

**Result:** Green — "Page appears clean."

---

### Example 2 — Phishing page with one social-engineering phrase (`http://phish.example/login`)

The page is HTTP, has a password field, and displays the text *"Security alert: verify your identity now"* (matching two phrases: `security alert` and `verify your identity`).

| Rule | Triggered? | Points |
|------|:---:|:---:|
| R1 — password field on HTTP | ✅ Yes | +40 |
| R2 — cross-origin form | No | 0 |
| R3 — `security alert` | ✅ Yes | +20 |
| R3 — `verify your identity` | ✅ Yes | +20 |
| R4 — misleading link | No | 0 |
| **Total** | | **80** |

**Result:** Critical — full quarantine overlay displayed. Score **80 ≥ 70**.

---

### Example 3 — Deceptive checkout page (`https://shop.evil/buy`)

The page is HTTPS so R1 does not fire. It contains a `<form action="https://harvest.attacker.com/collect">` (cross-origin), and one link whose visible text reads `paypal.com` but actually points to `paypal.attacker.com`.

| Rule | Triggered? | Points |
|------|:---:|:---:|
| R1 — password field on HTTP | No (HTTPS) | 0 |
| R2 — cross-origin form | ✅ Yes (`harvest.attacker.com`) | +50 |
| R3 — social-engineering phrase | No | 0 |
| R4 — misleading link (`paypal.com` → `paypal.attacker.com`) | ✅ Yes | +30 |
| **Total** | | **80** |

**Result:** Critical — full quarantine overlay. Score **80 ≥ 70**.

---

### Example 4 — Moderate-risk marketing page (`https://deal-site.example/offer`)

The page is HTTPS, no password fields, no cross-origin forms, but contains the phrases `urgent`, `limited time`, and `act now` in its copy, plus one misleading link (displays `amazon.com` but href is `amazon.deal-site.example`).

| Rule | Triggered? | Points |
|------|:---:|:---:|
| R1 — password field on HTTP | No | 0 |
| R2 — cross-origin form | No | 0 |
| R3 — `urgent` | ✅ Yes | +20 |
| R3 — `limited time` | ✅ Yes | +20 |
| R3 — `act now` | ✅ Yes | +20 |
| R4 — misleading link | ✅ Yes | +30 |
| **Total** | | **90** |

**Result:** Critical — full quarantine overlay. Score **90 ≥ 70**.

---

## Score Cap

There is no hard cap — scores above 100 are possible if many rules fire simultaneously. The threshold logic (`≥ 70` = critical, `> 0` = warning) still applies regardless of how far above 100 the score climbs.

---

## Limitations & False-Positive Notes

- **R3** matches any substring, so a news article *reporting* on a phishing attack may mention the phrases and receive a false-positive score. Always read the full forensic report in the popup.
- **R4** only checks links whose visible text contains a `.` and is longer than 4 characters; short or icon-only links are not evaluated.
- Scores reflect *signals detected at scan time*; they do not query external threat-intelligence databases. See the [Roadmap](./README.md#️-roadmap) for planned integrations.
