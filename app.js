const express = require("express") //express라이브러리 가져오고 그 라이브러리를 변수에 담음
const http=require("http")
const app=express()
const path=require("path")
const server=http.createServer(app)
const socketIO=require("socket.io")

const io=socketIO(server)

app.use(express.static(path.join(__dirname,"src")))
const PORT=process.env.PORT || 5000;//5000번 포트의 서버 생성

io.on("connection",(socket)=>{ //on은 클라이언트->서버(클라이언트가 서버에게 전송한 메시지 수신)
    socket.on("chatting",(data)=>{
        io.emit("chatting",data)//emit은 서버->클라이언트(서버가 클라이언트에게 메시지 전송)
    })
})

server.listen(PORT,()=>console.log("server is running "+PORT))

console.log(__dirname)