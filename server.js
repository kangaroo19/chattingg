const WebSocket=require('ws')
const ws=new WebSocket.Server({port:8004})

ws.on('connection',function connect(ws,req){
    console.log('new user connect')
})