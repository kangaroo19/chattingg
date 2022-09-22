
# 같은그림찾기



## 1.개요
(동영상 녹화해서 넣기)
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
### 서버접속
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
        //io.emit('myuserid1',data)
        ALL_US.push({'name':data.name,'img':data.img,'user_id':data.user_id,'authority':false,'turn':false,'score':0,'chosecard':[],'count':0})
        ALL_US.forEach((element,index)=>{
            io.emit('sendname',element)
        })
```
All_US는 접속한 모든 사용자의 정보 가지고 있는 배열
## 기술스택

 <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white"/>


 <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/>

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white"/>

<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white"/>

