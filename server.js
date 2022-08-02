<<<<<<< HEAD
<<<<<<< HEAD
const WebSocket=require('ws')
const ws=new WebSocket.Server({port:9000})

const path = require("path");
const express = require('express');
=======
const express=require('express')
>>>>>>> parent of 1d6f64e (123)
const app=express()
app.use("/",(req,res)=>{
    res.sendFile('./index.php')
})
const ws=app.listen(8080,()=>{
    console.log("Server is open")
=======
const express=require('express')
const app=express()

app.use('/',function(req,res){
    res.sendFile(__dirname+'./index.html')
>>>>>>> 15a1d6cc60159f8469b980dbb9e7ea04a76fddd8
})

app.listen(8081)



const WebSocket=require('ws')
<<<<<<< HEAD
//const ws=new WebSocket.Server({port:8080})
const webSocketServer=new wsModule.Server(
    {
        server:HTTPServer,
    }
)
=======
const ws=new WebSocket.Server({port:8080})


>>>>>>> 15a1d6cc60159f8469b980dbb9e7ea04a76fddd8
let user_id=0
let All_WS=[] //객체가 아닌 배열형태임에 유의

//원래는 ws
ws.on('connection',function connect(websocket,req){ //startbutton 클릭시 연결됨
    console.log('new user')
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
            case 'send_message':
                All_WS.forEach((element,index)=>{
                    let data={'code':'chat_message','msg':message.msg,'sender_name':message.name}
                    element.ws.send(JSON.stringify(data))
                })
                break;
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