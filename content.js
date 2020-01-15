console.log("Hello from your Messlackenger!")

function pollForElement(elem, timeout, callback) {
    const intervalPoll = setInterval(() => {
        const element = document.querySelector(elem);
        if (element){
            clearInterval(intervalPoll);
            callback();
        }
    }, 400);
    setTimeout(() => clearInterval(intervalPoll), timeout);
}

// From https://stackoverflow.com/questions/15505225/inject-css-stylesheet-as-string-using-javascript
function injectCss(css) {
    var node = document.createElement('style');
    node.innerHTML = css;
    document.body.appendChild(node);
}

pollForElement('[aria-label="Conversation List"]', 5000, getSelectors)

function getSelectors() {
    // beginObserve()
    const convoList = document.querySelector('[aria-label="Conversation List"]').children
    const convoExample = convoList[1].firstElementChild.firstElementChild.firstElementChild
    console.log(convoExample)
    const convoImageSelector = convoExample.firstElementChild.classList['0']
    injectCss('.' + convoImageSelector + ' { display: none }');

    const convoMessagePreview = convoExample.children[1].children[1]
    const convoMessagePreviewSelector = convoMessagePreview.classList['1']
    injectCss('.' + convoMessagePreviewSelector + ' { display: none }');
}

pollForElement('#message-dots', 5000, removeMessageRequests)

function removeMessageRequests() {
    const conversations = document.querySelector('[aria-label="Conversations"]');
    conversations.removeChild(conversations.firstElementChild)
}

// From https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// This function calls onMutation when new conversations are loaded in the DOM
function beginObserve() {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('[aria-label="Conversation List"]');

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Callback function to execute when mutations are observed
    const onMutation = function(mutationsList, observer) {
        if (mutationsList[0].type === 'childList') {            
            console.log('Child nodes added or removed.');
            // TODO: Process new conversations 
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(onMutation);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}