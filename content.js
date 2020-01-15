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

pollForElement('[aria-label="Conversation List"]', 5000, beginRestyle)

function beginRestyle() {
    const convoList = document.querySelector('[aria-label="Conversation List"]').children

    Array.from(convoList).forEach(node => {
        const convo = node.firstElementChild.firstElementChild.firstElementChild
        //remove conversation picture
        convo.removeChild(convo.firstElementChild)
        //remove conversation preview
        convo.firstElementChild.removeChild(convo.firstElementChild.children[1])
    })

}

pollForElement('#message-dots', 5000, removeMessageRequests)

function removeMessageRequests() {
    const conversations = document.querySelector('[aria-label="Conversations"]');
    conversations.removeChild(conversations.firstElementChild)
}