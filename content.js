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

const pollForConversationList = setInterval(() => {
    const convoList = document.querySelector('[aria-label="Conversation List"]');
    if (convoList){
        clearInterval(pollForConversationList);
        beginRestyle(convoList);
    }
}, 200)

function beginRestyle(convoList) {
    const convoLink = convoList.firstElementChild
    const convoLinkClasses = convoList.firstElementChild.classList['value']
    
    // Remove conversation images
    const convoImage = convoList.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    const convoImageClass = convoImage.classList['0']
    const convoImages = document.querySelectorAll('.'+convoImageClass)
    convoImages.forEach(node => node.parentNode.removeChild(node))
}

pollForElement('#message-dots', 5000, removeMessageRequests)

function removeMessageRequests() {
    const conversations = document.querySelector('[aria-label="Conversations"]');
    conversations.removeChild(conversations.firstElementChild)
    console.log('removed')
}