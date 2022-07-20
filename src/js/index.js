const mushroom=document.querySelector("#char1")
const nameInput=document.querySelector("#nameinput")
const startButton=document.querySelector("#startbutton")
const mainWindow=document.querySelector("#main-window")
const char=document.querySelector(".char")
const chattingWindow=document.querySelector("#chatting-window")
let img=["주황버섯.gif","파란버섯.gif"]
const array=['스포아','빨간달팽이','슬라임','리본돼지','주황버섯','초록버섯','파란버섯','뿔버섯']


function charClick(e){ //클릭한 아이디값 가져오는 함수
    let myChar=e
    let charId=e.getAttribute('id')
    let number=charId.substring(4,charId.length)
    let charName=array[number-1]
    nameInput.value=charName
    startButton.addEventListener("click",(event)=>{
        if(nameInput.value===""){
            alert("plz enter name")
        }
        else{
            mainWindow.classList.add("none")
            chattingWindow.classList.remove("none")
                   
           
            
        }
        
    })    
}

