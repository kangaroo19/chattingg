// const WebSocket=require('ws')
// const ws=new WebSocket.Server({port:9000})

// let user_id=0
// let All_WS=[] //객체가 아닌 배열형태임에 유의

// ws.on('connection',function connect(websocket,req){ //startbutton 클릭시 연결됨
//     console.log('new user')
//     user_id++
//     sendUserID(user_id)
//     All_WS.push({'ws':websocket,'user_id':user_id,'user_name':null,'user_img':null})
    
//     websocket.on('message',(message)=>{
//         message=JSON.parse(message)
//         switch(message.code){
//             case 'connected_user':
//                 //console.log(message)
//                 All_WS.forEach((element,index)=>{
//                     if(element.user_id==message.user_id){
//                         element.user_name=message.name
//                         element.user_img=message.img
//                     }
//                 })
//                 sendAllUsers()
//                 break
//             case 'send_message':
//                 All_WS.forEach((element,index)=>{
//                     let data={'code':'chat_message','msg':message.msg,'sender_name':message.name}
//                     element.ws.send(JSON.stringify(data))
//                 })
//                 break;
//             }
            
//     })
//     function sendUserID(user_id){
//         let data={'code':'my_user_id','msg':user_id}
//         websocket.send(JSON.stringify(data))
//     }
//     function sendAllUsers(){
//         let data={'code':'all_users','msg':JSON.stringify(All_WS)}
//         All_WS.forEach((element,index)=>{
//             element.ws.send(JSON.stringify(data))
//         })
//     }
// })


const express = require("express") 
const http=require("http")
const app=express()
const path=require("path")
const server=http.createServer(app)
const socketIO=require("socket.io")

const io=socketIO(server)

app.use(express.static(path.join(__dirname,"src")))
const PORT=process.env.PORT || 5005;



server.listen(PORT,()=>console.log("server is running "+PORT))

let user_id=0
let ALL_US=[]
let myid=null
io.on("connection",function connect(socket,req){
    socket.on('chatting',(data)=>{
        user_id++
        data.user_id=user_id
        myid=user_id
        sendUserId(user_id)
        io.emit('myuserid',data)
        io.emit('myuserid1',data)

        ALL_US.push({'name':data.name,'img':data.img,'user_id':data.user_id,'authority':false})
        ALL_US.forEach((element,index)=>{
            io.emit('sendname',element)
            
        })
        
        socket.on('sendmessage',(data)=>{
            data={'name':data.name,'msg':data.msg,'user_id':data.user_id,'authority':false}
            io.emit('chatmessage',data)
        })
        socket.on('p',(data)=>{
            if(data.user_id===1){
                ALL_US[0].user_id=data.user_id
                ALL_US[0].authority=true
            }
            else{
                ALL_US[1].user_id=data.user_id
                ALL_US[1].authority=true
            }
            io.emit('p1',data)
            if(ALL_US[0].authority===true && ALL_US[1].authority===true){
                console.log(123)
                io.emit('start',ALL_US)
            }
            
        })
        socket.on('pp',(data)=>{
            io.emit('pp1',data)
        })
        socket.emit('aa',data)
    })

    function sendUserId(user_id){
        let data={'user_id':user_id}
        socket.emit('aaa',data)
    }
})

//리본돼지 뿔버섯 순으로 들어왔을때 
//리본돼지 -> userid:1
//뿔버섯 -> userid:2 인데
//뿔버섯 레디버튼 누르고 리본돼지 레디버튼 누르면 잘 안됨
//myid부분이 잘못된듯
//client 부분에서 all_us 활용해볼것
