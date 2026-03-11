// Inject Styles Immediately
const styles = document.createElement('style');
styles.innerHTML = `
    .cyberops-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 999999; display: flex; justify-content: center; align-items: center; font-family: 'Segoe UI', sans-serif; color: white; }
    .cyberops-modal { background: #111; border: 1px solid #da3832; padding: 40px; border-radius: 12px; max-width: 600px; width: 90%; box-shadow: 0 0 50px rgba(218, 56, 50, 0.2); }
    .cyberops-title { color: #da3832; font-size: 24px; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
    .threat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
    .threat-item { background: #1e1e1e; padding: 10px; border-radius: 6px; font-size: 12px; border-left: 3px solid #da3832; }
    .cyber-btn { background: #224c87; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 15px; width: 100%; }
    .cyber-btn:hover { background: #1a3a66; }
    .highlight-danger { outline: 3px solid #da3832 !important; background: rgba(218, 56, 50, 0.1) !important; }
`;
document.head.appendChild(styles);

// The function that runs when "Deep Scan" is clicked
function performDeepScan() {
    const analysis = {
        score: 0,
        threats: [],
        positives: []
    };

    // --- 1. BEHAVIORAL ANALYSIS ---
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === 'password' && window.location.protocol !== 'https:') {
            analysis.threats.push("Insecure Password Field (HTTP)");
            analysis.score += 40;
        }
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const action = form.action || '';
        const currentHost = window.location.hostname;
        
        if (action.includes('://') && !action.includes(currentHost)) {
            // FIX: Used backticks ` ` for the text
            analysis.threats.push(`Data Exfiltration: Form sends to ${action.split('/')[2]}`);
            analysis.score += 50;
            form.classList.add('highlight-danger');
        }
    });

    // --- 2. HEURISTIC ENGINE ---
    const text = document.body.innerText.toLowerCase();
    
    const urgencyPhrases = ['verify your identity', 'account locked', 'unauthorized login', 'immediate action required', 'security alert', 'urgent'];
    urgencyPhrases.forEach(phrase => {
        if (text.includes(phrase)) {
            // FIX: Used backticks ` ` for the text
            analysis.threats.push(`Phrasing: "${phrase}"`);
            analysis.score += 20;
        }
    });

    // --- 3. VISUAL FORENSICS ---
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.href.toLowerCase();
        const textContent = link.innerText.toLowerCase();
        
        if (textContent.includes('.com') && href.includes('://') && !href.includes(textContent)) {
            // FIX: Used backticks ` ` for the text
            analysis.threats.push(`Link Masquerading: Text says "${textContent}" but goes to ${href}`);
            analysis.score += 30;
            link.classList.add('highlight-danger');
        }
    });

    // --- 4. DECISION ENGINE ---
    if (analysis.score === 0) {
        analysis.positives.push("No suspicious scripts detected.");
        analysis.positives.push("Secure Connection.");
    }

    chrome.runtime.sendMessage({ type: "SCAN_RESULT", score: analysis.score });

    if (analysis.score >= 70) {
        triggerQuarantine(analysis);
    } else if (analysis.score > 0) {
        showWarningBanner(analysis);
    }
}

function triggerQuarantine(data) {
    const overlay = document.createElement('div');
    overlay.className = 'cyberops-overlay';
    
    const threatList = data.threats.map(t => `<div class="threat-item">${t}</div>`).join('');
    
    overlay.innerHTML = `
        <div class="cyberops-modal">
            <div class="cyberops-title">
                <span style="font-size: 30px;">🛡️</span>
                THREAT QUARANTINED
            </div>
            <p style="color: #ccc; font-size: 14px;">CyberOps Agent has detected critical threats. Interaction with this page has been disabled.</p>
            
            <h3 style="color: #da3832; margin-top: 20px; font-size: 12px; text-transform: uppercase;">Forensic Report</h3>
            <div class="threat-grid">
                ${threatList}
            </div>
            
            <button class="cyber-btn" onclick="this.closest('.cyberops-overlay').remove()">I Understand The Risks (Dismiss)</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.querySelectorAll('button, input, a').forEach(el => {
        el.style.pointerEvents = 'none';
        el.style.opacity = '0.5';
    });
}

function showWarningBanner(data) {
    const banner = document.createElement('div');
    banner.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; background: #f59e0b; color: black; padding: 10px; z-index: 99999; font-family: sans-serif; font-size: 14px; font-weight: bold;";
    // FIX: Used backticks ` ` for the text
    banner.innerHTML = `⚠️ Warning: ${data.threats.length} potential anomalies detected. Be cautious. <span style="float: right; cursor: pointer;" onclick="this.parentElement.remove()">X</span>`;
    document.body.prepend(banner);
}