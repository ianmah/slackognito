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

pollForElement('[aria-label="Conversation List"]', 500, sidepanel)

function sidepanel() {
    const chatBanner = document.querySelector('[role="banner"]');
    chatBanner.style['display'] = 'none'
    
    const leftPanel = document.body.children[1].firstElementChild.firstElementChild.firstElementChild
    leftPanel.style['min-width'] = '230px'
    leftPanel.style['max-width'] = '230px'

    const convoList = document.querySelector('[aria-label="Conversation List"]').children
    const convoListElement = convoList[1]
    const convoListElementSelector = convoListElement.classList[1]
    addCss('.' + convoListElementSelector + '{ height: 28px }');

    const convoExample = convoList[1].firstElementChild.firstElementChild.firstElementChild
    // console.log(convoExample)

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
    
    let myConvoBanner = document.createElement('div')
    myConvoBanner.classList.add("myConvoBanner")

    let workspaceTitle = document.createElement('input')
    workspaceTitle.type = 'text'
    workspaceTitle.value = 'Type here and press enter'
    chrome.storage.local.get(["workspaceTitle"], (items) => {
        if (items.workspaceTitle) {
            workspaceTitle.value = items.workspaceTitle
        }
    })
    workspaceTitle.classList.add("workspaceTitle")
    workspaceTitle.classList.add("customInput")
    workspaceTitle.addEventListener('keyup', (e) => {
        //enter key
        if (e.keyCode === 13) {
            chrome.storage.local.set({ "workspaceTitle": workspaceTitle.value }, () => {
                // console.log('saved workspace title')
            });
            workspaceTitle.blur();
        }
    })

    let yourName = document.createElement('input')
    yourName.type = 'text'
    yourName.value = 'Type here and press enter'
    chrome.storage.local.get(["yourName"], (items) => {
        if (items.yourName) {
            yourName.value = items.yourName
        }
    })
    yourName.classList.add("yourName")
    yourName.classList.add("customInput")
    yourName.addEventListener('keyup', (e) => {
        //enter key
        if (e.keyCode === 13) {
            chrome.storage.local.set({ "yourName": yourName.value }, () => {
                // console.log('saved your nane')
            });
            yourName.blur();
        }
    })

    const yourNameWrapper = document.createElement('span')
    yourNameWrapper.classList.add("yourNameWrapper")
    yourNameWrapper.appendChild(yourName)

    myConvoBanner.appendChild(workspaceTitle)
    myConvoBanner.appendChild(yourNameWrapper)
    conversations.parentElement.insertBefore(myConvoBanner, conversations.parentElement.firstElementChild)
    addCss(`
        .myConvoBanner input {
            font-family: Lato;
            border:none;
            background-color:transparent;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
        }
        .myConvoBanner {
            padding: 8px 16px;
            cursor: pointer;
        }
        .myConvoBanner:hover {
            background-color: #00000022;
        }
        .workspaceTitle {
            font-size: 18px;
            font-weight: bold;
            text-overflow: ellipsis;
            color: #ffffff;
        }
        .yourName {
            padding-top: 2px;
            color: #ffffff88;
            margin: 0;
        }
        .yourNameWrapper::before {
            padding-right: 7px;
            content: "●";
            color: #00FFB7;
        }
    `)
    
    let myConvoPanel = document.createElement('div')
    myConvoPanel.classList.add("myConvoPanel") 
    let channelsLabel = document.createElement('p')
    channelsLabel.classList.add("channelsLabel")
    channelsLabel.appendChild(document.createTextNode("Channels"))
    myConvoPanel.appendChild(channelsLabel)
    conversations.parentElement.insertBefore(myConvoPanel, conversations)
    addCss(`
        .myConvoPanel {
            height: 28px;
            cursor: pointer;
        }
        .channelsLabel {
            font-weight: bold;
            transition: color 0.1s linear;
            margin: 0;
            padding-left: 12px;
            color: #ffffff88;
        }
        .channelsLabel:hover {
            color: #ffffff;
        }
        .channelsLabel::after {
            float: right;
            content: "⨁";
            font-weight: bold;
            padding-right: 15px;
            color: #ffffff88;
        }
    `)

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

pollForElement('[role="main"]', 500, mainpanel)

function mainpanel() {
    const main = document.querySelector('[role="main"]');

    const mainHeader = main.getElementsByTagName('span')[0].firstElementChild
    // ie _673w
    const mainHeaderSelector = mainHeader.classList[0]
    const mainHeaderCallIcons = mainHeader.children[1]
    // ie _fl2 
    const mainHeaderCallIconsSelector = mainHeaderCallIcons.classList[0]
    // ie "._673w ._fl2"
    // TODO: Modify icons to look like slack
    // addCss('.' + mainHeaderSelector + ' .' + mainHeaderCallIconsSelector + `{ display: none }`);


    const mainHeaderTitle = mainHeader.firstElementChild
    console.log(mainHeaderTitle)
    // Photo takes a while to load so poll
    const mainHeaderPhotoPoll = setInterval(() => {
        if (mainHeaderTitle.children.length === 2) {
            clearInterval(mainHeaderPhotoPoll)
            const mainHeaderPhoto = mainHeaderTitle.firstElementChild
            const mainHeaderPhotoSelector = mainHeaderPhoto.classList[0]
            addCss('.' + mainHeaderPhotoSelector + '{ display: none }');
        }
    }, 500)

    
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