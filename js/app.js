const nameInput=document.querySelector('#nameinput')
const startButton=document.querySelector('#startbutton')
const mainWindow=document.querySelector('#main-window')
const chattingWindow=document.querySelector('#chatting-window')
const chatInput=document.querySelector('#chat-input')
const chatWindow=document.querySelector('#chat-window')
const chatInputSend=document.querySelector('#chat-input-send')
const charImg1=document.querySelector('#char-img-1')
const charImg2=document.querySelector('#char-img-2')
const charImg3=document.querySelector('#char-img-3')
const charImg4=document.querySelector('#char-img-4')

const charName1=document.querySelector('#char-name-1')
const charName2=document.querySelector('#char-name-2')
const charName3=document.querySelector('#char-name-3')
const charName4=document.querySelector('#char-name-4')

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
function connect(){
<<<<<<< HEAD:js/app.js
    websocket=new WebSocket("ws://localhost:8080")
=======
    websocket=new WebSocket("ws://localhost:8081")
>>>>>>> 15a1d6cc60159f8469b980dbb9e7ea04a76fddd8:js/index.js
    websocket.onmessage=function(e){
        let message=JSON.parse(e.data)
        switch(message.code){
            case 'my_user_id':
                MY_USER_ID=message.msg //message.msg는 user_id
                charInfo.user_id=message.msg
                sendMyInfo(charInfo.name)
                break
            case 'all_users':
                let All_WS=JSON.parse(message.msg)
                All_WS.forEach((element,index)=>{
                    console.log(element)
                    if(element.user_id===1){
                        charImg1.src=element.user_img
                        charName1.innerHTML=element.user_name
                    }
                    else if(element.user_id===2){
                        charImg2.src=element.user_img
                        charName2.innerHTML=element.user_name
                    }
                    else if(element.user_id===3){
                        charImg3.src=element.user_img
                        charName3.innerHTML=element.user_name
                    }
                    else if(element.user_id===4){
                        charImg4.src=element.user_img
                        charName4.innerHTML=element.user_name
                    }
                })
                break
            case 'chat_message':
                $('#chat-window').append(`<div>
                ${message.sender_name}:${message.msg}
                </div>`)
                break

        }
    }
    function sendMyInfo(name){
        MY_NAME=name
        let data={'code':'connected_user','name':name,'img':charInfo.img,'user_id':MY_USER_ID}
        websocket.send(JSON.stringify(data))
    }
}

function sendMessage(){
    let message=chatInput.value
    let data={'code':'send_message','name':MY_NAME,'user_id':MY_USER_ID,'msg':message}
    websocket.send(JSON.stringify(data))
}
chatInputSend.addEventListener('click',sendMessage)
startButton.addEventListener('click',()=>{
    charInfo.name=nameInput.value//디폴트 캐릭터값(..주황버섯)이 아닌 본인이 정한 이름이면 최신화
    if(charInfo!=='' && nameInput.value!==''){
        connect()
        mainWindow.classList.add('none')
        chattingWindow.classList.remove('none')
    }
    else{
        alert('접속자명을 입력해 주세요')
    }
})



