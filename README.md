
# 같은그림찾기



[![Video Label](http://img.youtube.com/vi/4MjOzr2_iBo/0.jpg)](https://youtu.be/4MjOzr2_iBo)
실행화면 보려면 클릭



## 1.개요
어릴 때 재미있게 플레이하던 '메이플스토리'라는 게임 안에 있는 미니게임인 같은그림찾기게임을 채팅기능을 포함해 1vs1 온라인으로 할 수 있게 웹 상에 구현하였습니다.



## 2.미리보기

![1](https://user-images.githubusercontent.com/86513078/191254206-1a77524e-98c1-49ed-b6c9-7fbfa3691fed.PNG)


사이트에 접속하면 처음으로 나오는 캐릭터 선택화면으로 본인이 원하는 캐릭터를 선택하면 게임화면으로 넘어가게 됩니다. 기본값의 이름이 아닌 본인이 원하는 이름으로 시작 할 수도 있습니다. 시작버튼을 누르면 서버에 접속하게되고 게임을 시작하려면 두명의 플레이어가 필요합니다.


![2](https://user-images.githubusercontent.com/86513078/191254868-8d01683e-0eb9-4844-9609-faee9a45df17.PNG)

게임 화면으로 두명의 플레이어가 우측 중앙의 Ready버튼을 누르면 준비상태로 바뀌며 게임이 시작됩니다. 게임시작 전 이라면 준비상태를 취소 할 수도 있습니다.  

![3](https://user-images.githubusercontent.com/86513078/191255403-93275653-9366-4660-8f1b-560b1dc6ee80.PNG)

5초간의 카운트 후 본격적으로 게임이 시작됩니다 카드를 맞추면 +20,맞추는 데 실패하면 다음 플레이어에게 턴이 넘어가고 -10 방식으로 점수가 올라갑니다. 30장의 모든 카드가 오픈되면 게임이 끝납니다
5초 후에 서버와의 접속이 끊어지고 다시 캐릭터 선택 화면으로 돌아갑니다.

## 3.흐름도

<img src="https://user-images.githubusercontent.com/86513078/191548363-eb34832c-2a6d-4ecd-b87f-dd70befffadd.PNG" width="400" height="600"/>

## 4.코드
### 서버접속(클라이언트)
```JS
startButton.addEventListener('click',()=>{
    charInfo.name=nameInput.value
    if(charInfo!=='' && nameInput.value!==''){ 
        connect() //사용자정보 서버로 보내고 접속
        $('#window').css('border','none')
        $('#window').css('top','100px')
        
        mainWindow.classList.add('none') //캐릭터 선택창 사라지고
        chattingWindow.classList.remove('none') //게임화면 나옴
        mapAndLogo() //랜덤배경이미지 설정
    }
    else if(charInfo===''&&nameInput.value===''){ //캐릭터이름 정하지 않으면 경고창 출력
        $('.alert').removeClass('none')
        $('#desc').html("캐릭터를 선택하고 이름을 정해주세요.");
    }
})
```
### 서버접속(서버)
```JS
//위에서 connect함수 통해 보낸 정보 받음
socket.on('chatting',(data)=>{
        user_id++
        data.user_id=user_id
        myid=user_id //현재접속한 사용자의 아이디(고유한 값)저장
        myName=data.name //현재접속한 사용자의 이름 저장
        myImg=data.img //현재접속한 사용자의 캐릭터이미지 저장
        sendUserId(user_id) //현재접속한 사용자의 정보 클라이언트로 보냄
        io.emit('myuserid',data)
        ALL_US.push({'name':data.name,'img':data.img,'user_id':data.user_id,'authority':false,'turn':false,'score':0,'chosecard':[],'count':0})
        ALL_US.forEach((element,index)=>{
            io.emit('sendname',element)
        })
```
All_US는 접속한 모든 사용자의 정보 가지고 있는 배열
#### 사용자 정보(객체)
- user.name:사용자 이름 저장
- user.img:사용자가 선택한 캐릭터의 이미지 저장
- user.user_id:사용자 고유한 값인 저장
- user.authority:사용자권한,기본값은 false이고 준비버튼 누르면 true로 변함
- user.turn:기본값은 false이고 처음 게임이 시작되면 플레이어1은 true,플레이어2는 false로 변한다<br>
true 상태 일때만 카드 선택가능하고 false일때 카드 선택하면 경고창 출력됨,  플레이어가 카드 선택하다가 짝이 맞지 않으면 false상태로 바뀌고 다음플레이어가 true 상태로 변함,   짝이 맞으면 그대로 진행
- user.score:사용자 점수 저장
### 카드 판별
#### 카드 선택시
```JS
$('.card').on('click',(e)=>{
    if(player1.authority===true && player2.authority===true && cnt===0){
        //cnt==0은 게임시작 카운트(5초)될때 카드선택 못하게 하기위함
        if(mine.turn===true){
            let cardId=e.target.id //선택한 카드의 아이디값 
            let cardTarget=e.target //선택한 카드
            let cardNumber=Number(e.target.id.substring(4)) //선택한 카드의 번호
            if($(e.target).hasClass('opened')) return; //오픈된 카드(이미 맞춘카드)다시 선택하지 못하게하기 위함
            let cardName=cards[arr[cardNumber-1]]
            chosecard.push({'cardid':cardId,'cardname':cardName,'cardnumber':cardNumber,'cardtarget':cardTarget})
            socket.emit('card',chosecard) //선택한 카드 정보 서버로 보냄
        }
        else if(mine.turn===false){
            $('.alert').removeClass('none') //경고창 출력
            $('#desc').html("당신차례가 아닙니다.");
        }  
    }
})
```
선택한 카드정보는 chosecard배열안에 push한다
```JS
socket.on('card1',(data)=>{ 
    $('#'+data[data.length-1].cardid).attr("src",cards[arr[data[data.length-1].cardnumber-1]])
    if(data.length%2===0){//matchcard 함수는 카드를 두 장 고를때마다 실행
        matchCard(data)
    }
})
```
서버로 보낸 카드 정보 다시 클라이언트에서 받고 뒷면이 아닌 앞면 보여주고 matchCard함수 실행
#### matchCard()
```JS
function matchCard(chosecard){
    let n=chosecard.length-1
    if(chosecard[n-1].cardname===chosecard[n].cardname && mine.turn===true){//짝 맞을때
        socket.emit('opencard',chosecard) //열려잇는카드 .opened클래스 추가하여 못누르게
        mine.score=mine.score+20
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
```
matchCard함수는 카드 두 장 선택할 때마다 실행된다 이는 chosecard배열 안의 마지막요소와 마지막에서 두번째요소를 비교 판별하기 위함<br>
만약 선택한 카드의 이름이 서로 같다면 해당 사용자의 점수를 20점 더하고 짝을 맞춘 카드는 다시 선택할 필요 없으므로 opened클래스 추가하여 다시는 못누르게 한다<br>
선택한 카드의 이름이 서로 다르다면 다시 뒤집어 놓아야 하므로 이미지를 카드 뒷면이미지로 바꾸고 해당 사용자의 점수 10점 깎음, 턴 교체위해 내 정보 서버로 보냄

#### 서버측 턴교체 처리 
```JS
socket.on('changeplayer',(data)=>{
            data.turn=!data.turn
            socket.emit('changeplayer',data)
        })
 ```       
받은 사용자의 user.turn을 true면 false, false이면 true로 바꿈

### 게임종료
#### 클라이언트
```JS
let length=$('.opened').length //opened클래스의 개수 저장
    if(length===30){ //모든 카드(30장)가 짝 맞춘 상태일때
        if(player1.score>player2.score){ //player1 승리
            $('#chat-window').append(`<div style="color:yellow">
            [server]:${player1.name}님이 승리했습니다.
            </div>`)
        }
        else if(player1.score<player2.score){ //player2 승리
            $('#chat-window').append(`<div style="color:yellow">
            [server]:${player2.name}님이 승리했습니다.
            </div>`)
        }
        else{ 무승부
            $('#chat-window').append(`<div style="color:yellow">
            [server]:무승부입니다.
            </div>`)
        }
        $('#chat-window').append(`<div style="color:yellow">
            [server]:5초 후 종료됩니다.
            </div>`)
        scrollToBottom()
        setTimeout(()=>{
            socket.emit('init',MY_USER_ID) //사용자 정보 초기화
            window.location.reload() //페이지 새로고침,캐릭터 선택화면으로 돌아감
        },5000)
    }
```
#### 서버
```JS
socket.on('init',(data)=>{
            user_id=0
            ALL_US=[]
            myid=null
            myName=null
            myImg=null
            MyAu=false
            MyTurn=false
            socket.emit('init',user_id)
        })
```
모든 정보 초기화

### 게임 도중에 disconeect
#### 서버
```JS
socket.on('disconnect',function(){
            user_id=0
            ALL_US=[]
            myid=null
            myName=null
            myImg=null
            MyAu=false
            MyTurn=false
            io.emit('dc',user_id)
        })
```
모든 정보 초기화       
#### 클라이언트
```JS
socket.on('dc',(data)=>{
    player1=[]
    player2=[]
    MY_USER_ID=null
    ALL_US=[]
    setCards()
    window.location.reload()
})
```
player1, player2 빈 배열로 초기화 한 후 setCards함수 이용해 카드 재배치

#### setCards()
```JS
let arr=null
socket.on('rancard',(data)=>{//랜덤한값 서버로부터 받아옴
    arr=data //서버로부터 받아온 중복 없는 0~29사이의 랜덤한 값 저장
})

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
    
    const card=document.querySelectorAll('.card')
    for(let i=0;i<30;i++){
        card[i].src=cards[arr[i]]
    }
}
```
## 기술스택

 <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white"/> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white"/>





