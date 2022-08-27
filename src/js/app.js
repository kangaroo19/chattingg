

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
const body=document.querySelector("body");


const array=['img/스포아.png','img/빨간달팽이.png','img/슬라임.png','img/리본돼지.png','img/주황버섯.png','img/초록버섯.png','img/파란버섯.png','img/뿔버섯.png']
const array2=['img/스포아hit.png','img/빨간달팽이hit.png','img/슬라임hit.png','img/리본돼지hit.png','img/주황버섯hit.png','img/초록버섯hit.png','img/파란버섯hit.png','img/뿔버섯hit.png']
const map=[
            {'map':'img/커닝시티.PNG','name':'커닝시티','logo':'img/커닝시티로고.png','music':''},
            {'map':'img/헤네시스.PNG','name':'헤네시스','logo':'img/헤네시스로고.png','music':''},
            {'map':'img/페리온.PNG','name':'페리온','logo':'img/페리온로고.png','music':''},
            {'map':'img/엘리니아.PNG','name':'엘리니아','logo':'img/엘리니아로고.png','music':''},
            {'map':'img/리스항구.PNG','name':'리스항구','logo':'img/리스항구로고.png','music':''},
        ]
const logoimg=document.querySelector('#chatting-top-img')
function mapAndLogo(){
    let ran=Math.floor(Math.random()*map.length)
    body.style.backgroundImage='url('+map[ran].map+')'
    logoimg.src=map[ran].logo
    $('#chatting-top-desc').html(map[ran].name)
}

let websocket=null
let MY_USER_ID=''
let MY_NAME=''
let My_IMG=''
let MY_TURN=false
let MY_AU=false
let charInfo=''
let curimg={'charid':null,'target':null,'img':null}
function charClick(e){
    if(curimg.charid!==null){
        console.log(curimg.target)
        curimg.target.childNodes[0].src=curimg.img
    }
    curimg=e.childNodes[0]
    let charInfo1={'code':'charinfo','img':'','name':'','user_id':null}
    let charId=e.getAttribute('id')
    let number=charId.substring(4,charId.length)
    charInfo1.img=array[number-1]
    curimg.charid=charId
    curimg.target=e
    curimg.img=array[number-1]
    nameInput.value=charInfo1.img.substring(4,array[number-1].length-4)
    charInfo1.name=nameInput.value
    charInfo=charInfo1
    e.childNodes[0].src=array2[number-1]
}

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
    scrollToBottom()
})
socket.on('p1',(data)=>{
    $('#chat-window').append(`<div style="color:yellow">
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
    scrollToBottom()
})
socket.on('pp1',(data)=>{
    $('#chat-window').append(`<div style="color:yellow">
    [server]:${data.name}님이 준비 취소 했습니다.
    </div>`)
    if(data.user_id===1){
        player1Score.innerText='준비중'
    }
    else{
        player2Score.innerText='준비중'
    }
    scrollToBottom()

})
let mine=''
socket.on('start',(data)=>{//player1과 player2가 준비완료하면 실행
    gameStart.disabled=true
    let i=6
    setCards() //카드 랜덤하게
    let interval=setInterval(()=>{
        if(i>0){
            --i
            $('#chat-window').append(`<div style="color:yellow">
            [server]:${i}
            </div>`)
        }
        if(i===0){
            $('.card img').hide();
            $('#chat-window').append(`<div style="color:yellow">
            [server]:게임시작
            </div>`)
            clearInterval(interval)
            const card=document.querySelectorAll('.card')
            for(let i=0;i<30;i++){
                card[i].src='img/hidden-card.png'
            }
        }
        scrollToBottom()

    },1000)
    firstchar.classList.add('border')
    MY_AU=true
    player1.turn=true
    player2.turn=false
    player1Score.innerText=0
    player2Score.innerText=0
    mine={'name':MY_NAME,'userid':MY_USER_ID,'turn':MY_TURN,'score':0}
})

socket.on('myuserid',(data)=>{
    $('#chat-window').append(`<div style="color:yellow">
    [server]:${data.name}님이 접속했습니다.
    </div>`)
    scrollToBottom()
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
        $('.alert').removeClass('none')
        $('#desc').html("플레이어가 충분하지 않습니다.");
    }
}) 



startButton.addEventListener('click',()=>{
    charInfo.name=nameInput.value
    if(charInfo!=='' && nameInput.value!==''){
        connect()
        $('#window').css('border','none')
        $('#window').css('top','100px')
        
        mainWindow.classList.add('none')
        chattingWindow.classList.remove('none')
        mapAndLogo()
    }
    else if(charInfo===''&&nameInput.value===''){
        $('.alert').removeClass('none')
        $('#desc').html("캐릭터를 선택하고 이름을 정해주세요.");
    }
})

$('#alertbutton').on('click',()=>{
    $('.alert').addClass('none')
})

chatForm.addEventListener('submit',sendMessage)
function sendMessage(e){
    e.preventDefault()
    let message=chatInput.value
    let data={'name':charInfo.name,'user_id':MY_USER_ID,'msg':message}
    socket.emit('sendmessage',data)
    socket.emit('yorn',data)
    // socket.on('asdf',(data)=>{
    //     socket.emit('asdf',data)
    // })   
    // setCards()
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

const firstchar=document.getElementById('first-char')
const secondchar=document.getElementById('second-char')

let chosecard=[]
let a=''
$('.card').on('click',(e)=>{
    if(player1.authority===true && player2.authority===true){
        if(mine.turn===true){
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
            $('.alert').removeClass('none')
            $('#desc').html("당신차례가 아닙니다.");
        }

        
        // if(chosecard.length%2===0){
        //     matchCard(chosecard)        
        // }
    }
})
socket.on('card1',(data)=>{ 
    $('#'+data[data.length-1].cardid).attr("src",cards[arr[data[data.length-1].cardnumber-1]])
    if(data.length%2===0){//matchcard 함수는 카드를 두 장 고를때마다 실행
        matchCard(data)
    }
})
let temp=''
function matchCard(chosecard){
    let n=chosecard.length-1
    if(chosecard[n-1].cardname===chosecard[n].cardname && mine.turn===true){//짝 맞을때
        socket.emit('opencard',chosecard) //열려잇는카드 .opened클래스 추가하여 못누르게
        mine.score=mine.score+10
        socket.emit('playerscore3',mine)
    }
    else if(chosecard[n-1].cardname!==chosecard[n].cardname){//안맞을때
        setTimeout(()=>{
            $('#'+chosecard[n-1].cardid).attr("src",'img/hidden-card.png')
            $('#'+chosecard[n].cardid).attr("src",'img/hidden-card.png')
        },1000)
        
        socket.emit('changeplayer',mine)//턴 교체
        return 
    }
}
socket.on('opencard',(data)=>{
    let n=data.length-1
    $('#'+data[n-1].cardid).addClass('opened')
    $('#'+data[n].cardid).addClass('opened')
    
})
socket.on('playerscore3',(data)=>{
    console.log(player1,player2)
    if(data.userid===1){
        player1Score.innerText=data.score
        player1.score=data.score
        $('#chat-window').append(`<div style="color:yellow">
        [server]:${data.name}님이 맞췄습니다 계속 진행하세요
        </div>`)
    }
    else{
        player2Score.innerText=data.score
        player2.score=data.score
        $('#chat-window').append(`<div style="color:yellow">
        [server]:${data.name}님이 맞췄습니다 계속 진행하세요
        </div>`)
    }
    scrollToBottom()
    let length=$('.opened').length
    if(length===4){
        if(player1.score>player2.score){
            $('#chat-window').append(`<div style="color:yellow">
            [server]:${player1.name}님이 승리했습니다.
            </div>`)
        }
        else if(player1.score<player2.score){
            $('#chat-window').append(`<div style="color:yellow">
            [server]:${player2.name}님이 승리했습니다.
            </div>`)
        }
        else{
            $('#chat-window').append(`<div style="color:yellow">
            [server]:무승부입니다.
            </div>`)
        }
        $('#chat-window').append(`<div style="color:yellow">
            [server]:다시 시작하시겠습니까?(y/n).
            </div>`)
            // chatForm.addEventListener('submit',(e)=>{
            //     e.preventDefault()
            //     let data={'user_id':mine.userid,'msg':chatInput.value}
            //     socket.emit('yorn',data) 
            // })
        
        scrollToBottom()
        //setCards()
        for(let i=1;i<=30;i++){
            $('#card'+{i}).attr("src",'img/hidden-card.png')
        }
    }
})

socket.on('changeplayer',(data)=>{
    mine=data
    if(mine.userid===1 && mine.turn===false){
        socket.emit('playerscore1',mine)
    }
    else if(mine.userid===2 && mine.turn===false){
        socket.emit('playerscore2',mine)
    }
})

socket.on('playerscore1',(data)=>{
    mine.score=data.score-10
    player1.score=mine.score
    socket.emit('score',mine)
})
socket.on('playerscore2',(data)=>{
    mine.score=data.score-10
    player2.score=mine.score
    socket.emit('score',mine)

})

socket.on('score',(data)=>{
    if(data.userid===1){
        firstchar.classList.remove('border')
        secondchar.classList.add('border')
        player1Score.innerText=data.score
        $('#chat-window').append(`<div>
        [server]:${data.name}님이 틀렸습니다
        </div>`)
    }
    else{
        firstchar.classList.add('border')
        secondchar.classList.remove('border')
        player2Score.innerText=data.score
        $('#chat-window').append(`<div>
        [server]:${data.name}님이 틀렸습니다
        </div>`)
    }
    scrollToBottom()
})



function wait(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}

function scrollToBottom(){
    let bottom=chatWindow.scrollHeight
    chatWindow.scrollTo(0,bottom)
}
const opened=document.getElementsByClassName('.opened')
let aaa=0

//게임중간에 dc
//게임시작전에 dc
//게임다 끝나면(누군가가 승리했다면)->서버의 내용 다 비우고->캐릭터선택창

