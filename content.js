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
    const chatBanner = document.querySelector('[role="banner"]');
    console.log(chatBanner)
    chatBanner.style['display'] = 'none'

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


    // Poll for unread conversation (there may be no unread conversations on first load)
    const unreadConvoPoll = setInterval(() => {
        // highlighted conversations have aria-relevant="additions text"
        const highlightedConversations = document.querySelectorAll('[aria-relevant="additions text"]');
        // unread conversations have aria-live="polite"
        const unreadConversation = Array.from(highlightedConversations).filter(node => node.outerHTML.includes('aria-live="polite"'))[0]
        if (unreadConversation){
            clearInterval(unreadConvoPoll);
            // unread circle badge notification
            const unreadBadge = unreadConversation.children[1].firstElementChild
            const unreadBadgeSelector = unreadBadge.classList[1]
            addCss('.' + unreadBadgeSelector + '{ display: none }');
            // ie _1ht3
            const unreadConversationSelector = unreadConversation.classList[3];
            const unreadConversationTitle = unreadConversation.firstElementChild.firstElementChild.firstElementChild.children[1].firstElementChild.firstElementChild
            // ie _1ht6
            const unreadConversationTitleSelector = unreadConversationTitle.classList[0]
            // ie "._1ht3 ._1ht6"
            addCss('.' + unreadConversationSelector + ' .' + unreadConversationTitleSelector + `{ color: #ffffff; }`);
            injectCss();
        }
    }, 2000);

    // Poll for selected conversation (there may be no selected conversations on first load)
    const selectedConvoPoll = setInterval(() => {
        // highlighted conversations have aria-relevant="additions text"
        const highlightedConversations = document.querySelectorAll('[aria-relevant="additions text"]');
        // unread conversations have aria-live="polite"
        const selectedConvo = Array.from(highlightedConversations).filter(node => !node.outerHTML.includes('aria-live="polite"'))[0]
        if (selectedConvo){
            clearInterval(selectedConvoPoll);
            const selectedConvoSelector = selectedConvo.classList[3];
            addCss('.' + selectedConvoSelector + `{
                background-color: #8c5888 !important;
                color: white;
            }`);
            injectCss();
        }
    }, 2000);

    injectCss();
}

// Message requests has a div with id message-dots
pollForElement('#message-dots', 5000, removeMessageRequests)

function removeMessageRequests() {
    const conversations = document.querySelector('[aria-label="Conversations"]');
    conversations.firstElementChild.style['display'] = 'none'
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