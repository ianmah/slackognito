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

pollForElement('[aria-label="Conversation List"]', 5000, getSelectors)

let convoImageSelector;

function getSelectors() {
    beginObserve()
    const convoList = document.querySelector('[aria-label="Conversation List"]').children
    const convoExample = convoList[1].firstElementChild.firstElementChild.firstElementChild

    convoImageSelector = convoExample.firstElementChild.classList
    console.log(convoImageSelector)

    Array.from(convoList).forEach(node => {
        // const convo = node.firstElementChild.firstElementChild.firstElementChild
        //remove conversation picture

        //remove conversation preview
        // convo.firstElementChild.removeChild(convo.firstElementChild.children[1])
    })

}

pollForElement('#message-dots', 5000, removeMessageRequests)

function removeMessageRequests() {
    const conversations = document.querySelector('[aria-label="Conversations"]');
    conversations.removeChild(conversations.firstElementChild)
}



function beginObserve() {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('[aria-label="Conversation List"]');

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Callback function to execute when mutations are observed
    const onMutation = function(mutationsList, observer) {
        if (mutationsList[0].type === 'childList') {            
            console.log('Child nodes added or removed.');
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(onMutation);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}