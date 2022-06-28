const express = require("express") //express라이브러리 가져오고 그 라이브러리를 변수에 담음
const http=require("http")
const app=express()
const path=require("path")
const server=http.createServer(app)
const socketIO=require("socket.io")

const io=socketIO(server)

app.use(express.static(path.join(__dirname,"src")))
const PORT=process.env.PORT || 5000;

io.on("connection",(socket)=>{
    socket.on("chatting",(data)=>{
        io.emit("chatting",data)
    })
})

server.listen(PORT,()=>console.log("server is running "+PORT))

console.log(__dirname)