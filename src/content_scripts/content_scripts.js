console.log("____________________Content Script is alive __________________________")
const htmlDocumentValue = document.body.innerHTML
const htmlDocumentValueAsText = document.body.innerText

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    console.log("request gotten")
    if(request.action == "getAllHTML"){
        sendResponse({allHTML : {
            html : htmlDocumentValue,
            text : htmlDocumentValueAsText
        }})
    }
})