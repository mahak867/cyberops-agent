/**
 * popup.js -- CyberOps Agent popup controller
 *
 * Messaging flow:
 *   popup  --RUN_SCAN-->  content.js  --SCAN_RESULT-->  popup (via background)
 */

const scoreEl   = document.getElementById('riskScore');
const logEl     = document.getElementById('consoleLog');
const scanBtn   = document.getElementById('scanBtn');
const threatEl  = document.getElementById('threatList');

function log(msg) {
  logEl.textContent = '> ' + msg;
}

function renderThreats(threats, positives) {
  threatEl.innerHTML = '';
  const items = threats.length > 0 ? threats : positives;
  const color  = threats.length > 0 ? '#ef4444' : '#22c55e';
  items.forEach((t) => {
    const li = document.createElement('li');
    li.textContent = t;
    li.style.color = color;
    threatEl.appendChild(li);
  });
}

function applyScore(score, threats, positives) {
  scoreEl.textContent = score;
  if (score >= 70) {
    scoreEl.style.color = '#ef4444';
    log('CRITICAL THREAT DETECTED -- stay alert');
  } else if (score > 30) {
    scoreEl.style.color = '#f59e0b';
    log('MODERATE RISK -- be cautious');
  } else {
    scoreEl.style.color = '#22c55e';
    log('PAGE APPEARS CLEAN');
  }
  renderThreats(threats || [], positives || []);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'SCAN_RESULT') {
    applyScore(request.score, request.threats, request.positives);
  }
});

scanBtn.addEventListener('click', async () => {
  log('Initializing Deep Scan...');
  scoreEl.textContent = '--';
  scoreEl.style.color = '#94a3b8';
  threatEl.innerHTML = '';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) { log('Error: No active tab found.'); return; }

  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'RUN_SCAN' });
  } catch (_) {
    log('Cannot scan this page (browser or extension page).');
  }
});
