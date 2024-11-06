const policyForm = document.querySelector(".policy-form")
const policyTextarea = document.querySelector(".policy-textarea")
const allMessages = []
const chatBody = document.querySelector(".chat-body")

policyForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    const pastedValue = policyTextarea.value.trim()
    if(!pastedValue) return

    const userMessageAsObj = {
        id : Date.now(),
        from : "user",
        value : pastedValue
    }

    const aiMessageAsObj = {
        id : Date.now(),
        from : "ai",
        status : "loading",
        value : userMessageAsObj.value
    }

    allMessages.push(userMessageAsObj, aiMessageAsObj)
    renderDiv(userMessageAsObj)
    renderDiv(aiMessageAsObj)
})

function renderDiv({from , value, status}){
    if(from == "user"){
        renderNewUserMessage(value)
    }else if(from == "ai"){
        renderNewAiMessage()
    }else{
        alert("wrong type passed")
    }
}

function renderNewUserMessage(value){
    const userDiv = document.createElement("div")
    userDiv.className = "user-message"
    userDiv.innerHTML = `<div class="user-bubble">
                <p>${value}</p>
            </div>

            <img src="" alt="user icon" class="user-icon">`
    chatBody.appendChild(userDiv)
}

function renderNewAiMessage(value){
    const skeletonDiv = document.createElement("div")
    skeletonDiv.className = "reveal-ai-skeleton"
    skeletonDiv.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-response"></div>`
    chatBody.appendChild(skeletonDiv)
    skeletonDiv.scrollIntoView({
        block : "start",
        inline : "nearest",
        behavior : "smooth"
    })
}