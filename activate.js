function activate() {
    chrome.tabs.executeScript({
        file: 'inject.js'
    });
}

document.getElementById('activateSlackognito').addEventListener('click', activate);