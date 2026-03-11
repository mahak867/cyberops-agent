chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SCAN_RESULT") {
        console.log("Scan logged:", request.score);
    }
});