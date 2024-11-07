const policyForm = document.querySelector(".policy-form")
const policyTextarea = document.querySelector(".policy-textarea")
const allMessages = []
const chatBody = document.querySelector(".chat-body")
const baseUrl = "http://localhost:3000"

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
    policyTextarea.value = ""
})

function renderDiv({from , value, status}){
    if(from == "user"){
        renderNewUserMessage(value)
    }else if(from == "ai"){
        renderNewAiMessage(value)
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

async function renderNewAiMessage(value){
    const skeletonDiv = renderAiMessageSkeleton()
    try{
        const rawFetch = await fetch(`${baseUrl}/api/summary`, {
            method : "POST",
            body : JSON.stringify({
                privacyPolicy : value
            }),
            headers : {
                "Content-Type" : "application/json"
            }
        })

        const responseInJson = await rawFetch.json()

        if(!rawFetch.ok){
            throw new Error("an error ocurred", {cause : responseInJson})
        }

        skeletonDiv.remove()
        renderAiMessage(responseInJson)
        console.log(responseInJson) 
    }
    catch(err){
        alert("an error ocurred")
        console.error(err)
    }
}

function renderAiMessageSkeleton(){
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

    return skeletonDiv
}

function renderAiMessage(summaryObj){
    const  messageDiv = document.createElement("div")
    messageDiv.className = "reveal-ai-message"
    const summaryTitle = `Privacy Policy Summary from ${summaryObj.title}`
    let allSingleSummary =  ``

    summaryObj.summary.forEach((summary)=>{
        allSingleSummary += `<div class="single-summary">
                        <h1>${summary.title}</h1>
    
                        <p>${summary.description}</p>
    
                        <button class="secondary-button">View on page</button>
                    </div>`
    })

    messageDiv.innerHTML = ` <img src="../../assets/images/reveal-chat-icon-light.png" alt="reveal chat icon" class="reveal-icon">

            <div class="reveal-ai-bubble">
                <div class="reveal-bubble-header"> <h1>${summaryTitle}</h1></div>

                <div class="summaries-container">
                    ${allSingleSummary}
                </div>

                <div class="reveal-bubble-footer"> 
                    <button class="save-container"> <img src="../../assets/icons/save-icon-light.svg" alt="save icon"> <h3>Save</h3></button> 
                </div>
    </div>`
    chatBody.appendChild(messageDiv)
    messageDiv.scrollIntoView({
        block : "start",
        inline : "nearest",
        behavior : "smooth"
    })
}