/**
 * popup.js â€” CyberOps Agent popup controller
 *
 * Uses the correct MV3 messaging pattern:
 * popup sends RUN_SCAN message â†’ content.js handles it â†’ sends SCAN_RESULT back
 */

const scoreEl = document.getElementById('riskScore');
const logEl   = document.getElementById('consoleLog');
const scanBtn = document.getElementById('scanBtn');

function log(msg) {
  logEl.textContent = '> ' + msg;
}

function applyScore(score) {
  scoreEl.textContent = score;
  if (score > 70) {
    scoreEl.style.color = '#ef4444';
    log('CRITICAL THREAT DETECTED â€” stay alert');
  } else if (score > 30) {
    scoreEl.style.color = '#f59e0b';
    log('MODERATE RISK â€” be cautious');
  } else {
    scoreEl.style.color = '#22c55e';
    log('PAGE APPEARS CLEAN');
  }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'SCAN_RESULT') {
    applyScore(request.score);
  }
});

scanBtn.addEventListener('click', async () => {
  log('Initializing Deep Scan...');
  scoreEl.textContent = '--';
  scoreEl.style.color = '#94a3b8';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) { log('Error: No active tab found.'); return; }

  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'RUN_SCAN' });
  } catch {
    log('Cannot scan this page (browser or extension page).');
  }
});
