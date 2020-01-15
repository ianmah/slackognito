console.log("Hello from your Messlackenger!")

const pollForConversationList = setInterval(() => {
    const convoList = document.querySelector('[aria-label="Conversation List"]');
    if (convoList){
        clearInterval(pollForConversationList);
        beginRestyle(convoList);
    }
}, 200)

function beginRestyle(convoList) {
    const convoLink = convoList.children[1]
    const convoLinkClasses = convoList.children[1].classList['value']
    
    const convoImage = convoList.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild
    const convoImageClass = convoImage.classList['0']
    const convoImages = document.querySelectorAll('.'+convoImageClass)
    console.log(convoImages)
}