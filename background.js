/**
 * background.js -- CyberOps Agent service worker
 *
 * Responsibilities:
 *   1. Receive SCAN_RESULT messages from content.js and persist a rolling
 *      scan history (last 20 entries) to chrome.storage.local.
 *   2. Expose that history so a future history-dashboard page can read it.
 */

const MAX_HISTORY = 20;

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type !== 'SCAN_RESULT') return;

  const entry = {
    url: sender.tab?.url || 'unknown',
    score: request.score,
    threats: request.threats || [],
    timestamp: Date.now(),
  };

  chrome.storage.local.get({ scanHistory: [] }, (data) => {
    const history = [entry, ...data.scanHistory].slice(0, MAX_HISTORY);
    chrome.storage.local.set({ scanHistory: history });
  });
});
