import http from "http"; //웹소켓과 express합치기 별도의 ws서버를 구축하지 않는다.
import WebSocket from "ws"; //ws 추가
import express from "express"; //node서버 express사용
const app = express();
//console.log("hello");

//app.listen(3000);

app.set("view engine", "pug"); //뷰 엔진 pug 명시
app.set("views", __dirname + "/views"); // views폴더를 현재 디렉터리/views로
app.use("/public", express.static(__dirname + "/public")); //public폴더역할 지정
app.get("/", (_, res) => res.render("home")); //home.pug를 찾아간다. 루트 도메인
app.get("/*", (_, res) => res.redirect("/")); // 이외 나머지들은 /로 리다이렉트시킨다.
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//일반적으로 http서버 구현
//app.listen(3000, handleListen);

//이런형식으로 하면 websocket과 http서버를 동시에 돌릴 수 있다.
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });



//ws 통신 대기
function handleConnection(socket) {
    console.log(socket);
}
wss.on("connection", handleConnection);



server.listen(3000, handleListen);