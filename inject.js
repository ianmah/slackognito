console.log("Slackenger loaded successfully")

const headerFontSize = '18px'
const messageSenderPhotoSize = '36px'
const darkGreyColor = '#1c1c1c'
const lighterDarkGreyColor = '#1d1c1d'
const lightGreyColor = '#e4e4e4'

function pollForElement(elem, timeout, callback) {
    const intervalPoll = setInterval(() => {
        const element = document.querySelector(elem);
        if (element) {
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

addCss(`@import url('https://fonts.googleapis.com/css?family=Lato:400,900&display=swap');`);
addCss(`body{ font-family: 'Lato' !important }`);

pollForElement('[aria-label="Conversation List"]', 10000, sidepanel)

function sidepanel() {
    const chatBanner = document.querySelector('[role="banner"]');
    chatBanner.style['display'] = 'none'

    const sidePanelSelector = chatBanner.parentElement.classList[0]
    addCss(`.${sidePanelSelector} { background-color: #4f2f4c }`);


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
    chrome.storage.sync.get(["workspaceTitle"], (items) => {
        if (items.workspaceTitle) {
            workspaceTitle.value = items.workspaceTitle
        }
    })
    workspaceTitle.classList.add("workspaceTitle")
    workspaceTitle.classList.add("customInput")
    workspaceTitle.addEventListener('keyup', (e) => {
        //enter key
        if (e.keyCode === 13) {
            chrome.storage.sync.set({ "workspaceTitle": workspaceTitle.value }, () => {
                // console.log('saved workspace title')
            });
            workspaceTitle.blur();
        }
    })

    let yourName = document.createElement('input')
    yourName.type = 'text'
    yourName.value = 'Type here and press enter'
    chrome.storage.sync.get(["yourName"], (items) => {
        if (items.yourName) {
            yourName.value = items.yourName
        }
    })
    yourName.classList.add("yourName")
    yourName.classList.add("customInput")
    yourName.addEventListener('keyup', (e) => {
        //enter key
        if (e.keyCode === 13) {
            chrome.storage.sync.set({ "yourName": yourName.value }, () => {
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
            font-size: ${headerFontSize};
            font-weight: bold;
            text-overflow: ellipsis;
            color: #ffffff;
        }
        .yourName {
            font-size: 15px;
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
        if (unreadConversation) {
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
        if (selectedConvo) {
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

pollForElement('[role="main"]', 10000, mainpanel)

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

    // Modify svg paths
    addCss(`
        path {
            fill: white;
            stroke: #1d1c1d70;
            stroke-width: 1px;
        }
    `)

    const mainHeaderTitle = mainHeader.firstElementChild
    // Photo takes a while to load so poll
    const mainHeaderPhotoPoll = setInterval(() => {
        if (mainHeaderTitle.children.length === 2) {
            clearInterval(mainHeaderPhotoPoll)
            const mainHeaderPhoto = mainHeaderTitle.firstElementChild
            const mainHeaderPhotoSelector = mainHeaderPhoto.classList[0]
            addCss('.' + mainHeaderPhotoSelector + '{ display: none }');

            // const mainHeaderTitleSubtext = mainHeaderTitle.children[2].firstElementChild
            //TODO: Add icons and stuff to subtext
            addCss(`
                .${mainHeaderSelector} h2 {
                    font-size: ${headerFontSize} !important;
                    font-weight: 900 !important;
                }
                .${mainHeaderSelector} h2::before {
                    content: "#";
                    padding-right: 1px;
                    font-size: 17px;
                }
            `);

            injectCss();
        }
    }, 500)

    const newMessage = document.querySelector('[aria-label="New message"]').firstElementChild
    const newMessageSelector = newMessage.classList['value'].replace(' ', '.')
    addCss(`
        .${newMessageSelector} {
            margin: 0 20px 20px 20px;
            border: 1px solid ${darkGreyColor};
            border-radius: 5px;
        }
    `);
    const newMessageBox = newMessage.children[3]
    const newMessageBoxSelector = newMessageBox.classList[0]
    addCss(`
        .${newMessageBoxSelector} {
            background-color: white;
        }
    `);
    injectCss();

}

pollForElement('[aria-label="Messages"]', 10000, messages)
function messages() {
    //ie _1wfr 
    const messagesPanelSelector = document.querySelector('[role="presentation"]').firstElementChild.classList[1]
    addCss(`.${messagesPanelSelector} { padding: 0; }`)

    const infoPanel = document.querySelector('[data-testid="info_panel"]')
    if (infoPanel) {
        const infoPanelSelector = infoPanel.classList
        //TODO: Add a threads looking panel here
        addCss(`.${infoPanelSelector} { display: none; }`)
    }

    const messagesSelector = document.querySelector('[aria-label="Messages"]').classList[0]
    addCss(`
        .${messagesSelector} {
            padding-bottom: 10px;
        }
        .${messagesSelector} h4 {
            margin: 32px;
            width: 90%; 
            border-bottom: 1px solid #000; 
            border-color: ${lightGreyColor};
            line-height: 0.1em;
            font-weight: bold;
            color: ${lighterDarkGreyColor};
        }
        .${messagesSelector} time {
            padding: 8px 16px;
            background: white;
        }
    `)
    const messagesElem = document.querySelector('[aria-label="Messages"]').children[2]
    // Find your sent messages aka float right bubbles
    const pollForMyMessage = setInterval(() => {

        const myMessage = Array.from(messagesElem.children).filter(message => {
            const someElement = message.firstElementChild.firstElementChild
            if (someElement) {
                if (someElement.firstElementChild)
                    // Messages sent by yourself will have an h5 element
                    return someElement.firstElementChild.nodeName === 'H5'
            }
        })[0]

        if (myMessage) {
            clearInterval(pollForMyMessage)

            const otherMessage = Array.from(messagesElem.children).filter(message => {
                return message.firstElementChild.children.length === 2
            })[0]

            // the random div on top of messages sent by other people
            // ie _1t_q
            const randomEmptySpaceSelector = otherMessage.firstElementChild.firstElementChild.classList[0]
            addCss(`.${randomEmptySpaceSelector} { height: 0 }`)

            // ie _1t_p
            const messageGroupSelector = otherMessage.firstElementChild.classList[0]
            const messageSenderPhotoWrapper = otherMessage.firstElementChild.firstElementChild.firstElementChild.firstElementChild
            // ie _4ldz
            const messageSenderPhotoWrapperSelector = messageSenderPhotoWrapper.classList[0]
            // the selector that sets absolute position and bottom: 2
            // ie 
            const messageSenderPhotoWrapper2Selector = messageSenderPhotoWrapper.classList[1]
            const messageSenderPhoto = otherMessage.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild
            // ie _4ld-
            const messageSenderPhotoSelector = messageSenderPhoto.classList[0]
            addCss(`
                .${messageGroupSelector} {
                    padding: 6px 22px;
                    margin-bottom: 0;
                }
                .${messageGroupSelector}:hover {
                    background-color: #eeeeee88;
                }
                .${messageGroupSelector} h5 {
                    font-size: 15px;
                    font-weight: bold;
                    color: ${darkGreyColor};
                    cursor: pointer;
                }
                .${messageGroupSelector} h5:hover {
                    text-decoration: underline;
                }
                .${messageSenderPhotoWrapper2Selector} {
                    bottom: inherit !important;
                    top: 8px !important;
                }
                .${messageSenderPhotoWrapperSelector} {
                    transform: none !important;
                    height: ${messageSenderPhotoSize} !important;
                    width: ${messageSenderPhotoSize} !important;
                    max-height: ${messageSenderPhotoSize} !important;
                    max-width: ${messageSenderPhotoSize} !important;
                }
                .${messageSenderPhotoSelector} {
                    border-radius: 3px;
                    max-height: ${messageSenderPhotoSize} !important;
                    max-width: ${messageSenderPhotoSize} !important;
                    height: ${messageSenderPhotoSize} !important;
                    width: ${messageSenderPhotoSize} !important;
                }
                .${messageSenderPhotoSelector} img {
                    min-height: ${messageSenderPhotoSize} !important;
                    min-width: ${messageSenderPhotoSize} !important;
                    height: ${messageSenderPhotoSize} !important;
                    width: ${messageSenderPhotoSize} !important;
                }
            `)
            const myMessageGroup = myMessage.firstElementChild.firstElementChild.firstElementChild
            // ie _ih3
            const messageSenderSelector = myMessageGroup.classList[0]

            const myMessageExample = myMessage.firstElementChild.firstElementChild.children[1]
            // the one unique class that makes the message float right
            // ie _3i_m
            const myBubbleSelector = myMessageExample.classList[3]
            const myMessageExampleText = myMessage.firstElementChild.firstElementChild.children[1].firstElementChild
            // ie _3058
            const myMessageExampleTextSelector = myMessageExampleText.classList[0]
            // ie _hh7
            const messageTextSelector = myMessageExampleText.classList[2]
            addCss(`
                .${messageSenderSelector} {
                    clip: inherit !important;
                    height: inherit !important;
                    width: inherit !important;
                    position: inherit !important;
                    white-space: nowrap;
                    opacity: 1 !important;
                }
                .${myBubbleSelector} .${myMessageExampleTextSelector} {
                    float: left !important;
                }
                .${myMessageExampleTextSelector} {
                    padding: 1px 12px !important;
                    margin: 0 !important;
                }
                .${messageTextSelector} {
                    background-color: transparent !important;
                    background-image: none !important;
                    color: ${darkGreyColor} !important;
                }
            `)
            injectCss()
        }
    }, 1000);

    injectCss();
}

// Message requests has a div with id message-dots
pollForElement('#message-dots', 10000, removeMessageRequests)

function removeMessageRequests() {
    const messageDots = document.querySelector('#message-dots');
    const messageRequests = messageDots.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    messageRequests.style['display'] = 'none'
}

// From https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// This function calls onMutation when new conversations are loaded in the DOM
function beginObserve() {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('[aria-label="Conversation List"]');

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Callback function to execute when mutations are observed
    const onMutation = function (mutationsList, observer) {
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