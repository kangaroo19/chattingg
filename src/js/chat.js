"use strict"


const socket=io()

const nickname=document.querySelector("#nickname")
const chatList=document.querySelector(".chatting-list")
const chatInput=document.querySelector(".chatting-input")
const sendButton=document.querySelector(".send-button")

sendButton.addEventListener('click',()=>{
    const param={
        name:nickname.value,
        msg:chatInput.value
    }
    socket.emit("chatting",param)//chatting은 채널이름

})

//보낼때 emit 받을때 on
socket.on("chatting",(data)=>{
    console.log(data)
})
console.log(socket)