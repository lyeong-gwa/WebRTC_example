import http from "http"; //웹소켓과 express합치기 별도의 ws서버를 구축하지 않는다.
import { Server } from "socket.io"; // npm i socket.io
import express from "express"; //node서버 express사용
const app = express();

app.set("view engine", "pug"); //뷰 엔진 pug 명시
app.set("views", __dirname + "/views"); // views폴더를 현재 디렉터리/views로
app.use("/public", express.static(__dirname + "/public")); //public폴더역할 지정
app.get("/", (_, res) => res.render("home")); //home.pug를 찾아간다. 루트 도메인
app.get("/*", (_, res) => res.redirect("/")); // 이외 나머지들은 /로 리다이렉트시킨다.


//이런형식은 websocket과 http서버를 동시에 돌리는 방법
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function publicRooms() { //방의 개수 찾기
    const { //이것을 이해하고자 한다면 자바스크립트 객체의 특정 요소들 접근, Server구조를 알고있어야 함
        sockets: { //sids는 소켓아이디, rooms은 생성방
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}
function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
  }

wsServer.on("connection", (socket) => {
    socket["nickname"] = "익명";
    socket.onAny((event) => { //모든 이벤트에 대해 listen
        console.log(`Socket Event: ${event}`);
    });

    //방접속
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); //간단히 방에 등록가능
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });

    //연결해제 직전에 발생한다.
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
    });

    //연결해제 끝에 발생한다.
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });


    //새로운 메세지받으면 방내의 모든 사람들에게 메세지 전달
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    })

    //nickname으로 요청받으면 소켓에 nickname넣기
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});


httpServer.listen(3000, () => { console.log(`Listening on http://localhost:3000`) });

//ws 통신 대기
// wss.on("connection", (socket) =>{ //익명함수 선언방식
//     console.log(socket);
// });

//이 코드는 socket IO 안쓰고 구현한 예제코드 방관리 등 기능구현 하나하나 해야됨
//import WebSocket from "ws"; //ws 추가
//const wss = new WebSocket.Server({ server });
// const sockets = []; //소켓들 전부 관리
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "익명";
//     console.log("새로운 연결");
//     socket.on("close", () => console.log("브라우저와 연결해제"));
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {//메세지 타입에 따라 다른 처리
//           case "new_message":
//             sockets.forEach((aSocket) =>
//               aSocket.send(`${socket.nickname}: ${message.payload}`)
//             );
//           case "nickname":
//             socket["nickname"] = message.payload;
//         }
//     });
//     socket.send("서버와 연결하였습니다."); //브라우저에 전송하는 메세지
//   });