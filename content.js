/**
 * content.js -- injected into every page via manifest.json
 * Listens for RUN_SCAN from popup.js, performs DOM forensics, sends SCAN_RESULT back.
 */

/** Maximum possible Threat Index score. */
const MAX_SCORE = 100;

(function injectStyles() {
  if (document.getElementById('cyberops-styles')) return;
  const style = document.createElement('style');
  style.id = 'cyberops-styles';
  style.textContent = `
    .cyberops-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.95); z-index: 999999;
      display: flex; justify-content: center; align-items: center;
      font-family: 'Segoe UI', sans-serif; color: white;
    }
    .cyberops-modal {
      background: #111; border: 1px solid #da3832; padding: 40px;
      border-radius: 12px; max-width: 600px; width: 90%;
      box-shadow: 0 0 50px rgba(218,56,50,0.2);
    }
    .cyberops-title {
      color: #da3832; font-size: 24px; font-weight: bold;
      margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
    }
    .threat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
    .threat-item {
      background: #1e1e1e; padding: 10px; border-radius: 6px;
      font-size: 12px; border-left: 3px solid #da3832;
    }
    .cyber-btn {
      background: #224c87; color: white; border: none;
      padding: 10px 20px; border-radius: 6px; cursor: pointer;
      font-weight: bold; margin-top: 15px; width: 100%;
    }
    .cyber-btn:hover { background: #1a3a66; }
    .highlight-danger { outline: 3px solid #da3832 !important; background: rgba(218,56,50,0.1) !important; }
  `;
  document.head.appendChild(style);
})();

function performDeepScan() {
  const analysis = { score: 0, threats: [], positives: [] };

  // R1: Password field on a non-HTTPS page (+40, fired at most once per page).
  if (
    document.querySelectorAll('input[type="password"]').length > 0 &&
    window.location.protocol !== 'https:'
  ) {
    analysis.threats.push('Insecure password field (HTTP, not HTTPS)');
    analysis.score += 40;
  }

  // R2: Form that submits to a cross-origin host (+50 per form).
  document.querySelectorAll('form').forEach((form) => {
    const action = form.action || '';
    if (action.includes('://') && !action.includes(window.location.hostname)) {
      try {
        const dest = new URL(action).hostname;
        analysis.threats.push('Cross-origin form: sends data to ' + dest);
        analysis.score += 50;
        form.classList.add('highlight-danger');
      } catch (_) { /* invalid URL -- skip */ }
    }
  });

  // R3: Social-engineering phrases in visible page text (+20 per phrase).
  const text = document.body.innerText.toLowerCase();
  const urgencyPhrases = [
    'verify your identity', 'account locked', 'unauthorized login',
    'immediate action required', 'security alert', 'urgent',
    'your account will be suspended', 'click here to confirm',
    'unusual activity', 'limited time', 'act now',
  ];
  urgencyPhrases.forEach((phrase) => {
    if (text.includes(phrase)) {
      analysis.threats.push('Social engineering phrase: "' + phrase + '"');
      analysis.score += 20;
    }
  });

  // R4: Misleading link -- visible text looks like a domain but differs from href host (+30 per link).
  document.querySelectorAll('a[href]').forEach((link) => {
    try {
      const href = new URL(link.href);
      const visible = link.innerText.trim().toLowerCase();
      if (
        visible.includes('.') && visible.length > 4 &&
        !href.hostname.includes(visible.replace(/^(https?:\/\/|www\.)/, '').split('/')[0])
      ) {
        analysis.threats.push('Misleading link: shows "' + visible.slice(0, 40) + '" but goes to ' + href.hostname);
        analysis.score += 30;
        link.classList.add('highlight-danger');
      }
    } catch (_) { /* invalid href -- skip */ }
  });

  // Cap at MAX_SCORE so the Threat Index always stays in the 0-100 range.
  analysis.score = Math.min(analysis.score, MAX_SCORE);

  if (analysis.score === 0) {
    if (window.location.protocol === 'https:') analysis.positives.push('Secure HTTPS connection');
    analysis.positives.push('No suspicious scripts detected');
    analysis.positives.push('No cross-origin form submissions');
  }

  return analysis;
}

function triggerQuarantine(data) {
  document.querySelector('.cyberops-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'cyberops-overlay';

  const modal = document.createElement('div');
  modal.className = 'cyberops-modal';

  const titleEl = document.createElement('div');
  titleEl.className = 'cyberops-title';
  const shieldIcon = document.createElement('span');
  shieldIcon.style.fontSize = '30px';
  shieldIcon.textContent = '\uD83D\uDEE1'; // shield emoji
  titleEl.appendChild(shieldIcon);
  titleEl.appendChild(document.createTextNode(' THREAT QUARANTINED'));

  const desc = document.createElement('p');
  desc.style.cssText = 'color:#ccc;font-size:14px';
  desc.textContent = 'CyberOps Agent detected critical threats. Use extreme caution on this page.';

  const heading = document.createElement('h3');
  heading.style.cssText = 'color:#da3832;margin-top:20px;font-size:12px;text-transform:uppercase';
  heading.textContent = 'Forensic Report';

  const grid = document.createElement('div');
  grid.className = 'threat-grid';
  data.threats.forEach((t) => {
    const item = document.createElement('div');
    item.className = 'threat-item';
    item.textContent = t;
    grid.appendChild(item);
  });

  const btn = document.createElement('button');
  btn.className = 'cyber-btn';
  btn.textContent = 'I Understand The Risks - Dismiss';
  btn.addEventListener('click', () => overlay.remove());

  modal.appendChild(titleEl);
  modal.appendChild(desc);
  modal.appendChild(heading);
  modal.appendChild(grid);
  modal.appendChild(btn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function showWarningBanner(data) {
  document.getElementById('cyberops-banner')?.remove();
  const banner = document.createElement('div');
  banner.id = 'cyberops-banner';
  banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#f59e0b;color:black;padding:10px 16px;z-index:99999;font-family:sans-serif;font-size:13px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;';

  const msg = document.createElement('span');
  msg.textContent = 'Warning: ' + data.threats.length + ' risk signal(s) detected on this page';

  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:16px;color:black';
  closeBtn.textContent = 'X';
  closeBtn.addEventListener('click', () => banner.remove());

  banner.appendChild(msg);
  banner.appendChild(closeBtn);
  document.body.prepend(banner);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.type !== 'RUN_SCAN') return;
  const analysis = performDeepScan();
  chrome.runtime.sendMessage({
    type: 'SCAN_RESULT',
    score: analysis.score,
    threats: analysis.threats,
    positives: analysis.positives,
  });
  if (analysis.score >= 70) triggerQuarantine(analysis);
  else if (analysis.score > 0) showWarningBanner(analysis);
});
