const allPoliciesContainer = document.querySelector(".saved-policies-container");

async function init() {
    const savedPolicies = await chrome.storage.local.get(["revealSavedPolicies"]);
    const savedPoliciesInStorage = savedPolicies.revealSavedPolicies || [];

    // Clear the container first
    allPoliciesContainer.innerHTML = "";

    savedPoliciesInStorage.forEach((policy) => {
        let mainDiv = document.createElement("div");
        mainDiv.className = "single-saved-policy";

        // Join the mapped `policy.summary` to create a single HTML string
        const summaryHTML = policy.summary.map((p) => {
            return `
                <div class="single-summary">
                    <h1>${p.title}</h1>
                    <p>${p.description}</p>
                </div>`;
        }).join("");  // Convert array to a single string

        mainDiv.innerHTML = `
            <div class="single-policy-left">
                <div class="random-gradient ${policy.tag}"></div>
            </div>

            <div class="single-policy-right">
                <div class="single-policy-top">                     
                    <h1>${policy.title}</h1>
                    <button class="right">
                        <img src="../../assets/icons/delete-icon-light.svg" alt="delete icon" title="delete">
                    </button>
                </div>

                <div class="single-policy-bottom">
                    <p>${policy.summary.length} data collected</p>
                    <p>•</p>
                    <p>${policy.date}</p>
                    <p>•</p> 
                    <button>
                        View Details
                    </button>
                </div>
            </div>

            <div class="policy-modal">
                <button class="close">
                    <img src="../../assets/icons/close-icon-light.svg" alt="close icon">
                </button>

                <div class="modal">
                    <div class="modal-header">
                        <div class="random-gradient ${policy.tag}"></div>
                        <h1>${policy.title}</h1>
                    </div>

                    <div class="summary-container">
                        ${summaryHTML}  <!-- Inject the generated summary here -->
                    </div>
                </div>
            </div>
        `;

        // Append the `mainDiv` to the `allPoliciesContainer`
        allPoliciesContainer.appendChild(mainDiv)

        const displayModal = mainDiv.querySelector(".single-policy-bottom button")

        const closeModal = mainDiv.querySelector(".policy-modal .close")

        const policyModal = mainDiv.querySelector(".policy-modal")

        displayModal.addEventListener("click", ()=>{
            policyModal.classList.add("open")
        })

        closeModal.addEventListener("click", ()=>{
            policyModal.classList.remove("open")
        })
    });
}

init();
