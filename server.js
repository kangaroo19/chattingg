const WebSocket=require('ws')
const ws=new WebSocket.Server({port:8004})

let user_id=0
let All_WS=[]
ws.on('connection',function connect(websocket,req){ //startbutton 클릭시 연결됨
    user_id++
    console.log('new user entered')
    sendUserID(user_id)
    All_WS.push({'ws':websocket,'user_id':user_id,'user_name':''})
    websocket.on('message',(message)=>{
        message=JSON.parse(message)
        switch(message.code){
            case 'connected_user':
                //console.log(message)
                All_WS.forEach((element,index)=>{
                    if(element.user_id==message.user_id){
                        element.user_name=message.name
                    }
                })
                sendAllUsers()
                break
            }
            console.log(All_WS)
    })
    
    function sendUserID(user_id){
        let data={'code':'my_user_id','msg':user_id}
        websocket.send(JSON.stringify(data))
    }
    function sendAllUsers(){
        let data={'code':'all_user_id','msg':JSON.stringify(All_WS)}
        All_WS.forEach((element,index)=>{
            console.log(data.msg.user_name)
            element.ws.send(JSON.stringify(data))
        })
    }
})
//sendalluser까지 구현