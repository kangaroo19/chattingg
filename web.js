//소스트리에서 커밋 후 푸시해야 변경 반영됨
//

const { count } = require("console");
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const { emit } = require("process");
const server = http.createServer(app);
const socketIO = require("socket.io");

const io = socketIO(server);

app.use(express.static(path.join(__dirname, "src")));
const PORT = process.env.PORT || 8001;

server.listen(PORT, () => console.log("server is running " + PORT));
let ran = lottoNum();
console.log(ran);
let user_id = 0;
let ALL_US = [];
let myid = null;
let myName = null;
let myImg = null;
let MyAu = false;
let MyTurn = false;
let player1 = null;
let player2 = null;
let array = [];
io.on("connection", function connect(socket, req) {
  let score1 = 0;
  let score2 = 0;
  // console.group(ran)
  // ran=lottoNum()//크기 30의 배열로 0~29까지의 중복없는 랜덤한 수 반환하는 함수
  socket.on("chatting", (data) => {
    user_id++;
    data.user_id = user_id;
    myid = user_id; //현재접속한 사용자의 아이디(고유한 값)저장
    myName = data.name; //현재접속한 사용자의 이름 저장
    myImg = data.img; //현재접속한 사용자의 캐릭터이미지 저장
    sendUserId(user_id); //현재접속한 사용자의 정보 클라이언트로 보냄
    io.emit("myuserid", data);
    //io.emit('myuserid1',data)
    ALL_US.push({
      name: data.name,
      img: data.img,
      user_id: data.user_id,
      authority: false,
      turn: false,
      score: 0,
      chosecard: [],
      count: 0,
    });
    ALL_US.forEach((element, index) => {
      io.emit("sendname", element);
    });

    socket.on("sendmessage", (data) => {
      data = { name: data.name, msg: data.msg, user_id: data.user_id, authority: false };
      io.emit("chatmessage", data);
    });
    socket.on("p", (data) => {
      MyAu = true;
      if (data.user_id === 1) {
        ALL_US[0].user_id = data.user_id;
        ALL_US[0].authority = true;
      } else {
        ALL_US[1].user_id = data.user_id;
        ALL_US[1].authority = true;
      }
      io.emit("p1", data);
      if (ALL_US[0].authority === true && ALL_US[1].authority === true) {
        io.emit("start", ALL_US);
      }
      io.emit("c1", ALL_US);
    });
    socket.on("pp", (data) => {
      io.emit("pp1", data);
    });
    socket.emit("rancard", ran);

    socket.emit("aa", data);

    socket.on("card", (data) => {
      io.emit("card1", data);
    });

    socket.on("changeplayer", (data) => {
      data.turn = !data.turn;
      socket.emit("changeplayer", data);
    });

    socket.on("playerscore1", (data) => {
      socket.emit("playerscore1", data);
    });
    socket.on("playerscore2", (data) => {
      socket.emit("playerscore2", data);
    });
    socket.on("score", (data) => {
      if (data.userid === 1) {
        score1 = data.score;
        io.emit("score", data);
      } else {
        score2 = data.score;
        io.emit("score", data);
      }
    });
    socket.on("playerscore3", (data) => {
      io.emit("playerscore3", data);
    });
    socket.on("opencard", (data) => {
      io.emit("opencard", data);
    });
    socket.on("disconnect", function () {
      user_id = 0;
      ALL_US = [];
      myid = null;
      myName = null;
      myImg = null;
      MyAu = false;
      MyTurn = false;
      io.emit("dc", user_id);
    });
    socket.on("init", (data) => {
      user_id = 0;
      ALL_US = [];
      myid = null;
      myName = null;
      myImg = null;
      MyAu = false;
      MyTurn = false;
      socket.emit("init", user_id);
    });
  });
  function sendUserId(user_id) {
    if (user_id === 1) {
      MyTurn = true;
    } else {
      MyTurn = false;
    }
    let data = { user_id: user_id, name: myName, img: myImg, authority: MyAu, turn: MyTurn };
    socket.emit("aaa", data);
  }
});
function lottoNum() {
  //
  let lotto = [];
  let i = 0;
  while (i < 30) {
    let n = Math.floor(Math.random() * 30);
    if (notSame(n)) {
      lotto.push(n);
      i++;
    }
  }
  function notSame(n) {
    return lotto.every((e) => n !== e);
  }
  return lotto;
}
