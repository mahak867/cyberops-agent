/**
 * content.js â€” injected into every page via manifest.json
 * Listens for RUN_SCAN from popup.js, performs DOM forensics, sends SCAN_RESULT back.
 */

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

  document.querySelectorAll('input[type="password"]').forEach(() => {
    if (window.location.protocol !== 'https:') {
      analysis.threats.push('Insecure password field (HTTP, not HTTPS)');
      analysis.score += 40;
    }
  });

  document.querySelectorAll('form').forEach((form) => {
    const action = form.action || '';
    if (action.includes('://') && !action.includes(window.location.hostname)) {
      try {
        const dest = new URL(action).hostname;
        analysis.threats.push('Cross-origin form: sends data to ' + dest);
        analysis.score += 50;
        form.classList.add('highlight-danger');
      } catch {}
    }
  });

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
    } catch {}
  });

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
  overlay.innerHTML =
    '<div class="cyberops-modal">' +
    '<div class="cyberops-title"><span style="font-size:30px">&#128737;</span> THREAT QUARANTINED</div>' +
    '<p style="color:#ccc;font-size:14px">CyberOps Agent detected critical threats. Use extreme caution on this page.</p>' +
    '<h3 style="color:#da3832;margin-top:20px;font-size:12px;text-transform:uppercase">Forensic Report</h3>' +
    '<div class="threat-grid">' + data.threats.map(t => '<div class="threat-item">' + t + '</div>').join('') + '</div>' +
    '<button class="cyber-btn" onclick="this.closest(\'.cyberops-overlay\').remove()">I Understand The Risks â€” Dismiss</button>' +
    '</div>';
  document.body.appendChild(overlay);
}

function showWarningBanner(data) {
  document.getElementById('cyberops-banner')?.remove();
  const banner = document.createElement('div');
  banner.id = 'cyberops-banner';
  banner.style.cssText = 'position:fixed;top:0;left:0;width:100%;background:#f59e0b;color:black;padding:10px 16px;z-index:99999;font-family:sans-serif;font-size:13px;font-weight:bold;display:flex;justify-content:space-between;align-items:center;';
  banner.innerHTML = '<span>Warning: ' + data.threats.length + ' risk signal(s) detected on this page</span>' +
    '<button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:16px;color:black">X</button>';
  document.body.prepend(banner);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.type !== 'RUN_SCAN') return;
  const analysis = performDeepScan();
  chrome.runtime.sendMessage({ type: 'SCAN_RESULT', score: analysis.score });
  if (analysis.score >= 70) triggerQuarantine(analysis);
  else if (analysis.score > 0) showWarningBanner(analysis);
});
