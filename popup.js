document.getElementById('scanBtn').addEventListener('click', () => {
    log("Initializing Deep Scan...");
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: performDeepScan
        });
    });
});

// Listen for results from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SCAN_RESULT") {
        const score = request.score;
        const scoreEl = document.getElementById('riskScore');
        
        scoreEl.innerText = score;
        
        if (score > 70) {
            scoreEl.style.color = "#ef4444"; // Red
            log("❌ CRITICAL THREAT DETECTED");
        } else if (score > 30) {
            scoreEl.style.color = "#f59e0b"; // Amber
            log("⚠️ MODERATE RISK FOUND");
        } else {
            scoreEl.style.color = "#22c55e"; // Green
            log("✅ PAGE SECURE");
        }
    }
});

function log(msg) {
    const el = document.getElementById('consoleLog');
    el.innerText = `> ${msg}`;
}