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
    }else if(request.highlightWord){
        highlightText(request.highlightWord)
    }
})

function highlightText(phrase) {
    // Escape special characters in the phrase to avoid regex issues
    const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create a regular expression to find all instances of the phrase (case-insensitive)
    const regex = new RegExp(escapedPhrase, "gi");
    
    let firstHighlightedElement = null;  // Store the first highlighted element

    // Traverse all text nodes in the document
    function walkThroughNodes(node) {
        // If this is a text node and contains the phrase, replace it
        if (node.nodeType === Node.TEXT_NODE) {
            if (regex.test(node.nodeValue)) {
                // Create a span for the highlighted text
                const span = document.createElement("span");
                span.className = "highlight"; // Add the highlight class
                span.innerHTML = node.nodeValue.replace(regex, `<mark>$&</mark>`);
                
                // Replace the text node with the new highlighted span
                node.parentNode.replaceChild(span, node);

                // Save the first highlighted element for scrolling
                if (!firstHighlightedElement) {
                    firstHighlightedElement = span.querySelector("mark");
                }
            }
        } else {
            // Recursively check child nodes
            node.childNodes.forEach(walkThroughNodes);
        }
    }

    // Start traversal from the body
    document.body.childNodes.forEach(walkThroughNodes);

    // Scroll the first highlighted element into view, if found
    if (firstHighlightedElement) {
        firstHighlightedElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}