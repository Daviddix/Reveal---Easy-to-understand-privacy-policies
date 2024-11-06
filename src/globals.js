const hamburgerMenu = document.querySelector(".menu-icon")
const nav = document.querySelector(".nav")
const navCloseButton = document.querySelector(".nav .overlay > button")

hamburgerMenu.addEventListener("click", (e)=>{
    nav.classList.add("open")
})

navCloseButton.addEventListener("click", (e)=>{
    nav.classList.remove("open")
})