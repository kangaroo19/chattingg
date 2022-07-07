const mushroom=document.querySelector("#char1")
const nameInput=document.querySelector("#nameinput")
const startButton=document.querySelector("#startbutton")
const mainWindow=document.querySelector("#main-window")
const char1=document.querySelector("#char1")
const char2=document.querySelector("#char2")
const chattingWindow=document.querySelector("#chatting-window")
let myName=""
let img=["주황버섯.gif","파란버섯.gif"]
const mine=document.querySelector("#mine")
const mineImg=document.querySelector("mine-img")
const mineName=document.querySelector("mine-name")

char1.addEventListener("click",()=>{
    nameInput.value="주황버섯" //디폴트값
    
})
console.dir(nameInput)
char2.addEventListener("click",()=>{
    nameInput.value="파란버섯" //디폴트값
})
startButton.addEventListener("click",()=>{
    if(nameInput.value===""){
        alert("plz enter name")
    }
    else{
        mainWindow.classList.add("none")
        chattingWindow.classList.remove("none")
        const name=nameInput.value
        
    }
    
})
