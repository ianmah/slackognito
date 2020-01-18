function activate() {
    chrome.tabs.executeScript({
        file: 'content.js'
    });
}

document.getElementById('activateSlackognito').addEventListener('click', activate);