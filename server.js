const WebSocket=require('ws')
const ws=new WebSocket.Server({port:8004})

let user_id=0
let All_WS=[] //객체가 아닌 배열형태임에 유의
ws.on('connection',function connect(websocket,req){ //startbutton 클릭시 연결됨
    user_id++
    sendUserID(user_id)
    All_WS.push({'ws':websocket,'user_id':user_id,'user_name':null,'user_img':null})
    
    websocket.on('message',(message)=>{
        message=JSON.parse(message)
        switch(message.code){
            case 'connected_user':
                //console.log(message)
                All_WS.forEach((element,index)=>{
                    if(element.user_id==message.user_id){
                        element.user_name=message.name
                        element.user_img=message.img
                    }
                })
                sendAllUsers()
                break
            }
            
    })
    function sendUserID(user_id){
        let data={'code':'my_user_id','msg':user_id}
        websocket.send(JSON.stringify(data))
    }
    function sendAllUsers(){
        let data={'code':'all_users','msg':JSON.stringify(All_WS)}
        All_WS.forEach((element,index)=>{
            element.ws.send(JSON.stringify(data))
        })
    }
})
