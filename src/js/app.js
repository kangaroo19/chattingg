const nameInput=document.querySelector('#nameinput')
const startButton=document.querySelector('#startbutton')
const mainWindow=document.querySelector('#main-window')
const chattingWindow=document.querySelector('#chatting-window')
const chatForm=document.querySelector('#chatForm')
const chatInput=document.querySelector('#chatForm input')
const chatWindow=document.querySelector('#chat-window')
const chatInputSend=document.querySelector('#chat-input-send')
const gameStart=document.querySelector(".gamestart")
const charImg1=document.querySelector('#char-img-1')
const charImg2=document.querySelector('#char-img-2')
const charImg3=document.querySelector('#char-img-3')
const charImg4=document.querySelector('#char-img-4')

const charName1=document.querySelector('#char-name-1')
const charName2=document.querySelector('#char-name-2')
const charName3=document.querySelector('#char-name-3')
const charName4=document.querySelector('#char-name-4')

const player1=document.querySelector('#player1')
const player2=document.querySelector('#player2')

const array=['img/스포아.png','img/빨간달팽이.png','img/슬라임.png','img/리본돼지.png','img/주황버섯.png','img/초록버섯.png','img/파란버섯.png','img/뿔버섯.png']

let websocket=null
let MY_USER_ID=''
let MY_NAME=''
let charInfo=''
function charClick(e){
    let charInfo1={'code':'charinfo','img':'','name':'','user_id':null}
    let charId=e.getAttribute('id')
    let number=charId.substring(4,charId.length)
    charInfo1.img=array[number-1]
    //charInfo1.name=array[number-1].substring(4,array[number-1].length-4)
    //nameInput.value=charInfo1.name
    nameInput.value=charInfo1.img.substring(4,array[number-1].length-4)
    charInfo1.name=nameInput.value
    charInfo=charInfo1
}
// function connect(){

//     websocket=new WebSocket("ws://localhost:8080")

//     websocket.onmessage=function(e){
//         let message=JSON.parse(e.data)
//         switch(message.code){
//             case 'my_user_id':
//                 MY_USER_ID=message.msg //message.msg는 user_id
//                 charInfo.user_id=message.msg
//                 sendMyInfo(charInfo.name)
//                 break
//             case 'all_users':
//                 let All_WS=JSON.parse(message.msg)
//                 All_WS.forEach((element,index)=>{
//                     console.log(element)
//                     if(element.user_id===1){
//                         charImg1.src=element.user_img
//                         charName1.innerHTML=element.user_name
//                     }
//                     else if(element.user_id===2){
//                         charImg2.src=element.user_img
//                         charName2.innerHTML=element.user_name
//                     }
//                     else if(element.user_id===3){
//                         charImg3.src=element.user_img
//                         charName3.innerHTML=element.user_name
//                     }
//                     else if(element.user_id===4){
//                         charImg4.src=element.user_img
//                         charName4.innerHTML=element.user_name
//                     }
//                 })
//                 break
//             case 'chat_message':
//                 $('#chat-window').append(`<div>
//                 ${message.sender_name}:${message.msg}
//                 </div>`)
//                 break

//         }
//     }
//     function sendMyInfo(name){
//         MY_NAME=name
//         let data={'code':'connected_user','name':name,'img':charInfo.img,'user_id':MY_USER_ID}
//         websocket.send(JSON.stringify(data))
//     }
// }

// function sendMessage(){
//     let message=chatInput.value
//     let data={'code':'send_message','name':MY_NAME,'user_id':MY_USER_ID,'msg':message}
//     websocket.send(JSON.stringify(data))
// }
// chatInputSend.addEventListener('click',sendMessage)
// startButton.addEventListener('click',()=>{
//     charInfo.name=nameInput.value//디폴트 캐릭터값(..주황버섯)이 아닌 본인이 정한 이름이면 최신화
//     if(charInfo!=='' && nameInput.value!==''){
//         connect()
//         mainWindow.classList.add('none')
//         chattingWindow.classList.remove('none')
//     }
//     else{
//         alert('접속자명을 입력해 주세요')
//     }
// })
const socket=io()
const ALL_US=[]
function connect(){
    const data={'code':'new_user','name':charInfo.name,'img':charInfo.img,'user_id':null,'authority':false}
    socket.emit('chatting',data)
    socket.on('sendname',(data)=>{
                MY_USER_ID=data.user_id
                console.log(data)
                
                if(data.user_id===1){
                    charImg1.src=data.img
                    charName1.innerHTML=data.name
                    ALL_US[data.user_id-1]=data
                }
                else if(data.user_id===2){
                    charImg2.src=data.img
                    charName2.innerHTML=data.name
                    ALL_US[data.user_id-1]=data
                }
                else if(data.user_id===3){
                    charImg3.src=data.img
                    charName3.innerHTML=data.name
                }
                else if(data.user_id===4){
                    charImg4.src=data.img
                    charName4.innerHTML=data.name
                }   
                console.log(ALL_US)
        })
        socket.on('chatmessage',(data)=>{
            $('#chat-window').append(`<div>
            [${data.name}]:${data.msg}
           </div>`)
           chatInput.value=''
        })
        socket.on('a2',(data)=>{
            $('#chat-window').append(`<div>
            [server]:${data.name}님이 준비했습니다.
            </div>`)
        })
        socket.on('a3',(data)=>{
            $('#chat-window').append(`<div>
            [server]:${data.name}님이 준비 취소 했습니다.
            </div>`)
        })
        socket.on('myuserid',(data)=>{
            $('#chat-window').append(`<div>
            [server]:${data.name}님이 접속했습니다.
            </div>`)
        })
        
    }

gameStart.addEventListener('click',()=>{
    if(gameStart.innerText==='Ready'){
        gameStart.innerText='Cancle'
        let data={'name':charInfo.name,'user_id':MY_USER_ID,'authority':true}
        socket.emit('a1',data)

    }
    else{
        gameStart.innerText='Ready'
        let data1={'name':charInfo.name,'user_id':MY_USER_ID,'authority':false}
        socket.emit('a2',data1)
    }
})





startButton.addEventListener('click',()=>{
    charInfo.name=nameInput.value
    if(charInfo!=='' && nameInput.value!==''){
        connect()
        mainWindow.classList.add('none')
        chattingWindow.classList.remove('none')
    }
})


chatForm.addEventListener('submit',sendMessage)
function sendMessage(e){
    e.preventDefault()
    let message=chatInput.value
    let data={'name':charInfo.name,'user_id':MY_USER_ID,'msg':message}
    socket.emit('sendmessage',data)
}


socket.on('aa',(data)=>{
    if(data.user_id===3 || data.user_id===4){
        gameStart.disabled=true
    }
})

