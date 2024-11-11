const hamburgerMenu = document.querySelector(".menu-icon")
const nav = document.querySelector(".nav")
const navCloseButton = document.querySelector(".nav .overlay > button")
const themeSwitchButton = document.querySelector(".theme-switch")

const hamburgerIcon = document.querySelector("header button img[alt = 'menu icon']")
const viewMoreButton = document.querySelector(".active-option > img[alt='view more']")
const revealLogo = document.querySelector(".logo-container > img[alt='reveal logo']")
const closeIcon = document.querySelector(".overlay button > img[alt='close icon']")
const linkIcon = document.querySelector(".support-container > img[alt='open link icon']")
const themeSwitcherIcon = document.querySelector(".theme-switch > img")
const searchIcon = document.querySelector(".search > img[alt='search icon']")
const allViewMoreIcons = document.querySelectorAll(".single-policy-bottom button img[alt='view more icon']")
const saveIcon = document.querySelector(".save-container img[alt='save icon']")

//globals
window.AppGlobals = window.AppGlobals || {
    appTheme: ""
};

hamburgerMenu.addEventListener("click", (e)=>{
    nav.classList.add("open")
})

navCloseButton.addEventListener("click", (e)=>{
    nav.classList.remove("open")
})

init()

themeSwitchButton.addEventListener("click", ()=>{
    if(document.body.classList.contains("light")){
        switchToDarkMode()
    }else if(document.body.classList.contains("dark")){
        switchToLightMode()
    }
})

async function switchToDarkMode(){
    await chrome.storage.local.set({revealTheme : "dark"})
    AppGlobals.appTheme = "dark"
    document.body.classList.remove("light")
    document.body.classList.add("dark")
    hamburgerIcon.src = hamburgerIcon.src.replace("light", "dark")
    revealLogo.src = revealLogo.src.replace("light", "dark")
    closeIcon.src = closeIcon.src.replace("light", "dark")
    linkIcon.src = linkIcon.src.replace("light", "dark")
    themeSwitcherIcon.src = themeSwitcherIcon.src.replace("moon", "sun")

    searchIcon? searchIcon.src = searchIcon.src.replace("light", "dark") : null

    allViewMoreIcons ? allViewMoreIcons.forEach((icon)=>{
        icon.src = icon.src.replace("light", "dark")
    }) : null

    viewMoreButton ? viewMoreButton.src = viewMoreButton.src.replace("light", "dark") : null

    saveIcon ? saveIcon.src = saveIcon.src.replace("light", "dark") : null
}

async function switchToLightMode(){
    await chrome.storage.local.set({revealTheme : "light"})
    AppGlobals.appTheme = "light"
    document.body.classList.remove("dark")
    document.body.classList.add("light")
    hamburgerIcon.src = hamburgerIcon.src.replace("dark", "light")
    revealLogo.src = revealLogo.src.replace("dark", "light")
    closeIcon.src = closeIcon.src.replace("dark", "light")
    linkIcon.src = linkIcon.src.replace("dark", "light")
    themeSwitcherIcon.src = themeSwitcherIcon.src.replace("sun", "moon")

    searchIcon? searchIcon.src = searchIcon.src.replace("dark", "light") : null

    allViewMoreIcons ? allViewMoreIcons.forEach((icon)=>{
        icon.src = icon.src.replace("dark", "light")
    }) : null

    viewMoreButton ? viewMoreButton.src = viewMoreButton.src.replace("dark", "light") : null

    saveIcon ? saveIcon.src = saveIcon.src.replace("dark", "light") : null
}

async function init(){
    const theme = await chrome.storage.local.get(["revealTheme"])
    const themeInStorage = theme.revealTheme || "light"

    themeInStorage == "light" ? switchToLightMode() : switchToDarkMode()
}