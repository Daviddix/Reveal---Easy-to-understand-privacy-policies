const policyForm = document.querySelector(".policy-form")
const policyTextarea = document.querySelector(".policy-textarea")
const allMessages = []
const chatBody = document.querySelector(".chat-body")
const baseUrl = "http://localhost:3000"
const summaryOptionsToggle = document.querySelector(".active-option")
const optionsModal = document.querySelector(".modal")
const optionsButtons = document.querySelectorAll(".modal-options > button")
const generateSummaryButton = document.querySelector(".policy-form .primary")
let policySource = summaryOptionsToggle.innerText
const inputArea = document.querySelector(".input-section")

//initial function
init(policySource)

//eventListeners
policyForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    toggleInputState()
    const pastedValue = policyTextarea.value.trim()
    if(policySource == "Extract From Page"){
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
        const response = await chrome.tabs.sendMessage(tab.id, {action: "getAllHTML"})

        const pageHTMLValue = response.allHTML.html
        const pageHTMLValueAsText = response.allHTML.text

        const userMessageAsObj = {
            id : Date.now(),
            from : "user",
            value : pageHTMLValueAsText
        }
    
        const aiMessageAsObj = {
            id : Date.now(),
            from : "ai",
            source : policySource,
            value : pageHTMLValue
        }
    
        allMessages.push(userMessageAsObj, aiMessageAsObj)
        renderDiv(userMessageAsObj)
        renderDiv(aiMessageAsObj)
        policyTextarea.value = ""
    }else if(policySource == "Paste Manually"){
        if(!pastedValue) return
    
        const userMessageAsObj = {
            id : Date.now(),
            from : "user",
            value : pastedValue
        }
    
        const aiMessageAsObj = {
            id : Date.now(),
            from : "ai",
            source : policySource,
            value : userMessageAsObj.value
        }
    
        allMessages.push(userMessageAsObj, aiMessageAsObj)
        renderDiv(userMessageAsObj)
        renderDiv(aiMessageAsObj)
        policyTextarea.value = ""
    }
})

summaryOptionsToggle.addEventListener("click", (e)=>{
    optionsModal.classList.toggle("open")
})

optionsButtons.forEach((button)=>{
    button.addEventListener("click", (e)=>{
        policySource = e.currentTarget.innerHTML
        updatePolicySourceUi(policySource)
        updateTextareaUI(policySource)
        optionsModal.classList.remove("open")
    })
})


//functions
function renderDiv({from , value, source}){
    if(from == "user"){
        renderNewUserMessage(value)
    }else if(from == "ai"){
        if(source == "Paste Manually"){
            startAiMessageProcessingFromPaste(value)
        }else if(source == "Extract From Page"){
            startAiMessageProcessingFromPage(value)
        }
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

async function startAiMessageProcessingFromPaste(value, source){
    const skeletonDiv = renderAiMessageSkeleton()
    try{
        console.log(source)
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

        renderAiSummaryFromPaste(responseInJson)
        console.log(responseInJson) 
    }
    catch(err){
        skeletonDiv.remove()
        renderErrorUi(value, source)
        console.error(err)
    }
}

async function startAiMessageProcessingFromPage(value, source){
    const skeletonDiv = renderAiMessageSkeleton()
    try{
        const rawFetch = await fetch(`${baseUrl}/api/summary/page`, {
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

        renderAiSummaryFromPage(responseInJson)
        console.log(responseInJson) 
    }
    catch(err){
        skeletonDiv.remove()
        renderErrorUi(value, source)
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

function renderErrorUi(value, source){
    const errorDiv = document.createElement("div")
    errorDiv.className = "reveal-ai-error-bubble"
    const button = document.createElement("button")
    button.addEventListener("click", ()=>{
        errorDiv.remove()
        if(source == "Paste Manually"){
            startAiMessageProcessingFromPaste(value, source)
        }else if(source == "Extract From Page"){
            startAiMessageProcessingFromPage(value, source)
        }
    })
    button.textContent = "Retry"
    errorDiv.innerHTML = `
            <p>Oops, seems like an error ocurred when we tried to generate your policy summary, please try again</p>`
    errorDiv.appendChild(button)
    chatBody.appendChild(errorDiv)
}

function renderAiSummaryFromPaste(summaryObj){
    const  messageDiv = document.createElement("div")
    messageDiv.className = "reveal-ai-message"
    const summaryTitle = `Privacy Policy Summary for ${summaryObj.title}`
    let allSingleSummary =  ``

    summaryObj.summary.forEach((summary)=>{
            allSingleSummary += `<div class="single-summary">
                            <h1>${summary.title}</h1>
        
                            <p>${summary.description}</p>
    
                        </div>`
    })

    messageDiv.innerHTML = ` <img src="../../assets/images/reveal-chat-icon-light.png" alt="reveal chat icon" class="reveal-icon">

            <div class="reveal-ai-bubble">
                <div class="reveal-bubble-header"> <h1>${summaryTitle}</h1></div>

                <div class="summaries-container">
                    ${allSingleSummary}
                </div>

                <div class="reveal-bubble-footer"> 
                    <button class="save-container"> 
                    <img src="../../assets/icons/save-icon-light.svg" alt="save icon"> <h3>Save</h3>
                    </button> 
                </div>
    </div>`

    const saveButton = messageDiv.querySelector(".save-container")

    saveButton.addEventListener("click", async (e)=>{
        await savePolicyToStorage(summaryObj)
        const oldValue = saveButton.innerHTML 
        saveButton.innerHTML = `<h3>Saved</h3>`

        setTimeout(() => {
            saveButton.innerHTML = oldValue
        }, 1500);
    })

    chatBody.appendChild(messageDiv)
    toggleInputState()

    messageDiv.scrollIntoView({
        block : "start",
        inline : "nearest",
        behavior : "smooth"
    })
}

async function savePolicyToStorage(policyObj){
    const previous = await chrome.storage.local.get(["revealSavedPolicies"])
    const previousValueInStorage = await previous.revealSavedPolicies || []

    const newValue = [
        ...previousValueInStorage,
        policyObj
    ]

    await chrome.storage.local.set({revealSavedPolicies : newValue})
}

function renderAiSummaryFromPage(summaryObj){
    const  messageDiv = document.createElement("div")
    messageDiv.className = "reveal-ai-message"
    const summaryTitle = `Privacy Policy Summary for ${summaryObj.title}`
    let allSingleSummary =  ``

    summaryObj.summary.forEach((summary)=>{
            allSingleSummary += `<div class="single-summary">
                            <h1>${summary.title}</h1>
        
                            <p>${summary.description}</p>
        
                            <button data-phrase="${summary.exactPhrase}" class="secondary-button">View on page</button>
                        </div>`
    })

    messageDiv.innerHTML = `<img src="../../assets/images/reveal-chat-icon-light.png" alt="reveal chat icon" class="reveal-icon">

            <div class="reveal-ai-bubble">
                <div class="reveal-bubble-header"> <h1>${summaryTitle}</h1></div>

                <div class="summaries-container">
                    ${allSingleSummary}
                </div>

                <div class="reveal-bubble-footer"> 
                    <button class="save-container"> <img src="../../assets/icons/save-icon-light.svg" alt="save icon"> <h3>Save</h3></button> 
                </div>
    </div>`

    const viewOnPageButtons = messageDiv.querySelectorAll(".secondary-button")

    viewOnPageButtons.forEach((button)=>{
        button.addEventListener("click", async (e)=>{
            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
            await chrome.tabs.sendMessage(tab.id, {highlightWord: e.target.dataset.phrase})
            console.log(e.target.dataset.phrase)
        })
    })

    const saveButton = messageDiv.querySelector(".save-container")

    saveButton.addEventListener("click", async (e)=>{
        await savePolicyToStorage(summaryObj)
        const oldValue = saveButton.innerHTML 
        saveButton.innerHTML = `<h3>Saved</h3>`

        setTimeout(() => {
            saveButton.innerHTML = oldValue
        }, 1500);
    })

    chatBody.appendChild(messageDiv)
    toggleInputState()
    messageDiv.scrollIntoView({
        block : "start",
        inline : "nearest",
        behavior : "smooth"
    })
}

function updatePolicySourceUi(value){
    summaryOptionsToggle.innerHTML = `${value} <img src= ../../assets/icons/view-more-${AppGlobals.appTheme == "light" ? "light" : "dark"}.svg alt="view more">`
}

function updateTextareaUI(value){
    if(value == "Extract From Page"){
        policyTextarea.setAttribute("disabled", true)
        generateSummaryButton.innerText = "Generate From Page"
    }else if(value == "Paste Manually"){
        policyTextarea.removeAttribute("disabled")
        generateSummaryButton.innerText = "Generate Summary"
    }else{
        alert("Wrong type passed")
    }
}

async function init(initialValue){
    updateTextareaUI(initialValue)
}

function toggleInputState(){
    inputArea.classList.toggle("loading")
}