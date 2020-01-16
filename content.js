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

let css = '';
function addCss(input) {
    css += input;
}

// From https://stackoverflow.com/questions/15505225/inject-css-stylesheet-as-string-using-javascript
function injectCss() {
    var node = document.createElement('style');
    node.innerHTML = css;
    document.body.appendChild(node);
    css = ''
}

addCss(`@import url('https://fonts.googleapis.com/css?family=Lato&display=swap');`);
addCss(`body{ font-family: 'Lato' !important }`);

pollForElement('[aria-label="Conversation List"]', 5000, getSelectors)

function getSelectors() {

    const leftPanel = document.body.children[1].firstElementChild.firstElementChild.firstElementChild
    leftPanel.style['min-width'] = '230px'
    leftPanel.style['max-width'] = '230px'

    const convoList = document.querySelector('[aria-label="Conversation List"]').children

    const convoListElement = convoList[1]
    const convoListElementSelector = convoListElement.classList[1]
    addCss('.' + convoListElementSelector + '{ height: 28px }');

    const convoExample = convoList[1].firstElementChild.firstElementChild.firstElementChild
    console.log(convoExample)

    const convoTitleText = convoExample.children[1].firstElementChild.firstElementChild
    const convoTitleTextSelector = convoTitleText.classList[1]
    addCss('.' + convoTitleTextSelector + `::before { content: "# "; color: #8a8a8a99; padding-right: 2px }`);
    addCss('.' + convoTitleTextSelector + ' { color: #ffffff88 }');

    const convoImageSelector = convoExample.firstElementChild.classList[0]
    addCss('.' + convoImageSelector + '{ display: none }');

    const convoMessagePreview = convoExample.children[1].children[1]
    const convoMessagePreviewSelector = convoMessagePreview.classList[1]
    addCss('.' + convoMessagePreviewSelector + '{ display: none }');

    const conversations = document.querySelector('[aria-label="Conversations"]');
    const conversationSidebar = conversations.parentElement.parentElement.parentElement;
    conversationSidebar.style['background-color'] = '#4f2f4c';

    // highlighted conversations have aria-relevant="additions text"
    const highlightedConversations = document.querySelectorAll('[aria-relevant="additions text"]');

    // unread conversations have aria-live="polite"
    const unreadConversation = Array.from(highlightedConversations).filter(node => node.outerHTML.includes('aria-live="polite"'))[0]
    const unreadConversationSelector = unreadConversation.classList[3];
    const unreadConversationTitle = unreadConversation.firstElementChild.firstElementChild.firstElementChild.children[1].firstElementChild.firstElementChild
    const unreadConversationTitleSelector = unreadConversationTitle.classList[0]
    addCss('.' + unreadConversationSelector + ' .' + unreadConversationTitleSelector + `{ color: #ffffff; }`);

    // unread conversations have aria-live="polite"
    const selectedConversation = Array.from(highlightedConversations).filter(node => !node.outerHTML.includes('aria-live="polite"'))[0]
    const selectedConversationSelector = selectedConversation.classList[3];
    addCss('.' + selectedConversationSelector + `{
        background-color: #8c5888 !important;
        color: white;
    }`);

    injectCss();
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