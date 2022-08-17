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

const gameWindow=document.querySelector('.game-window')

const charName1=document.querySelector('#char-name-1')
const charName2=document.querySelector('#char-name-2')
const charName3=document.querySelector('#char-name-3')
const charName4=document.querySelector('#char-name-4')
const card=document.querySelectorAll('.card')
const player1Score=document.querySelector('#player1-score')
const player2Score=document.querySelector('#player2-score')
const firstcard=document.querySelector('#card1')

const array=['img/스포아.png','img/빨간달팽이.png','img/슬라임.png','img/리본돼지.png','img/주황버섯.png','img/초록버섯.png','img/파란버섯.png','img/뿔버섯.png']
let websocket=null
let MY_USER_ID=''
let MY_NAME=''
let My_IMG=''
let MY_TURN=false
let MY_AU=false
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
let player1=[]
let player2=[]

function connect(){
    socket.on('aaa',(data)=>{
        
        MY_NAME=data.name
        My_IMG=data.img
        MY_USER_ID=data.user_id
        MY_TURN=data.turn
    })
    
    const data={'code':'new_user','name':charInfo.name,'img':charInfo.img,'user_id':MY_USER_ID,'authority':false}
    socket.emit('chatting',data)
    socket.on('sendname',(data)=>{
        if(data.user_id===1){
            charImg1.src=data.img
            charName1.innerHTML=data.name
            ALL_US[data.user_id-1]=data
            player1=ALL_US[0]  
        }
        else if(data.user_id===2){
            charImg2.src=data.img
            charName2.innerHTML=data.name
            ALL_US[data.user_id-1]=data
            player2=ALL_US[1]   
        }
        else if(data.user_id===3){
            charImg3.src=data.img
            charName3.innerHTML=data.name
        }
        else if(data.user_id===4){
            charImg4.src=data.img
            charName4.innerHTML=data.name
        }

    })
}
socket.on('chatmessage',(data)=>{
    $('#chat-window').append(`<div>
    [${data.name}]:${data.msg}
    </div>`)
    chatInput.value=''
    
})
socket.on('p1',(data)=>{
    $('#chat-window').append(`<div>
    [server]:${data.name}님이 준비했습니다.
    </div>`)
    if(data.user_id===1){
        player1=data
        player1Score.innerText='준비'
       
    }
    else{
        player2=data
        player2Score.innerText='준비'

    }
})
socket.on('pp1',(data)=>{
    $('#chat-window').append(`<div>
    [server]:${data.name}님이 준비 취소 했습니다.
    </div>`)
    if(data.user_id===1){
        player1Score.innerText='준비중'
    }
    else{
        player2Score.innerText='준비중'
    }
})
let mine=''
socket.on('start',(data)=>{//player1과 player2가 준비완료하면 실행
    gameStart.disabled=true
    let i=6
    setCards()//카드 랜덤하게
    let interval=setInterval(()=>{
        if(i>0){
            --i
            $('#chat-window').append(`<div>
            [server]:${i}
            </div>`)
        }
        if(i===0){
            $('.card img').hide();
            $('#chat-window').append(`<div>
            [server]:게임시작
            </div>`)
            clearInterval(interval)
            const card=document.querySelectorAll('.card')
            for(let i=0;i<30;i++){
                card[i].src='img/hidden-card.png'
            }
        }
    },250)
    MY_AU=true
    player1.turn=true
    player2.turn=false
    player1Score.innerText=0
    player2Score.innerText=0
    mine={'name':MY_NAME,'userid':MY_USER_ID,'turn':MY_TURN}
    console.log(mine)
})

socket.on('myuserid',(data)=>{
    $('#chat-window').append(`<div>
    [server]:${data.name}님이 접속했습니다.
    </div>`)
})
gameStart.addEventListener('click',()=>{
    if(ALL_US.length===2){
        if(gameStart.innerText==='Ready'){
            gameStart.innerText='Cancle'
            let data={'name':charInfo.name,'user_id':MY_USER_ID,'authority':true,'turn':false,'score':0,'chosecard':[],'count':0}
            socket.emit('p',data)
        }
        else if(gameStart.innerText==='Cancle'){
            gameStart.innerText='Ready'
            let data={'name':charInfo.name,'user_id':MY_USER_ID,'authority':false,'turn':false,'score':0,'chosecard':[],'count':0}
            socket.emit('pp',data)
        }
    }
    else{
        alert('not enough player')
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



function generateRandom(min,max){
    let ranNum=Math.floor(data*(max-min+1))+min
     return ranNum
}


let arr=null
socket.on('rancard',(data)=>{//랜덤한값 서버로부터 받아옴
    arr=data
})
let cardall=''
function setCards(){
    cards=[
        'img/돼지.png','img/돼지.png',
        'img/드레이크.png','img/드레이크.png',
        'img/레이스.png','img/레이스.png',
        'img/로랑.png','img/로랑.png',
        'img/루팡.png','img/루팡.png',
        'img/리본돼지카드.png','img/리본돼지카드.png',
        'img/엄티.png','img/엄티.png',
        'img/옥토퍼스.png','img/옥토퍼스.png',
        'img/와일드카고.png','img/와일드카고.png',
        'img/우는파란버섯.png','img/우는파란버섯.png',
        'img/이블아이.png','img/이블아이.png',
        'img/커즈아이.png','img/커즈아이.png',
        'img/콜드아이.png','img/콜드아이.png',
        'img/파란달팽이.png','img/파란달팽이.png',
        'img/뿔버섯카드.png','img/뿔버섯카드.png'
    ]
    cardall=cards
    const card=document.querySelectorAll('.card')
    for(let i=0;i<30;i++){
        card[i].src=cards[arr[i]]
    }
}
for(let i=1;i<=30;i++){
    $('.game-window').append(`<img src="img/hidden-card.png" id=card${i} class=card>`)
    if(i%6===0){
        $('.game-window').append(`<br>`)
    }
}


let chosecard=[]
let a=''
$('.card').on('click',(e)=>{
    if(player1.authority===true && player2.authority===true){
        if(mine.turn===true){
            console.log(e)
            let cardId=e.target.id
            let cardTarget=e.target
            a=cardId
            let cardNumber=Number(e.target.id.substring(4))
            if($(e.target).hasClass('opened')) return;
            //e.target.src=cards[arr[cardNumber-1]]
            //console.log(e.target)
            let cardName=cards[arr[cardNumber-1]]
            chosecard.push({'cardid':cardId,'cardname':cardName,'cardnumber':cardNumber,'cardtarget':cardTarget})
            socket.emit('card',chosecard)
        }
        else if(mine.turn===false){
            alert('not your turn')
        }

        
        // if(chosecard.length%2===0){
        //     matchCard(chosecard)        
        // }
    }
})
socket.on('card1',(data)=>{ //원래는 이 함수를 위의 이벤트에 넣었는데 안됏었음 생각해보면 당연한거
    
    $('#'+data[data.length-1].cardid).attr("src",cards[arr[data[data.length-1].cardnumber-1]])
    if(data.length%2===0){
        matchCard(data)
    }
})
let temp=''
function matchCard(chosecard){
    let n=chosecard.length-1
    
    if(chosecard[n-1].cardname===chosecard[n].cardname){//짝 맞을때
        console.log('correct')
        $('#'+chosecard[n-1].cardid).addClass('opened')
        $('#'+chosecard[n].cardid).addClass('opened')
    }
    else if(chosecard[n-1].cardname!==chosecard[n].cardname){//안맞을때
        console.log('incorrect')
        setTimeout(()=>{
            $('#'+chosecard[n-1].cardid).attr("src",'img/hidden-card.png')
            $('#'+chosecard[n].cardid).attr("src",'img/hidden-card.png')
        },1000)
        socket.emit('changeplayer',mine)
        socket.on('changeplayer',(data)=>{
            mine=data
            console.log(mine)
        })
        return 
    }
}


function wait(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}
