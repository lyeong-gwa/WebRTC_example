//브라우저 역할
//alert("hi");
//socket 영역
// const socket = new WebSocket(`ws://${window.location.host}`); //그냥 http://localhost하면 안됨
// socket.addEventListener("open", () => {
//     console.log("연결 시작");
// })
// socket.addEventListener("message", (message) => {
//     const li = document.createElement("li");
//     li.innerText = message.data;
//     messageList.append(li);
// });
// socket.addEventListener("close", () => {
//     console.log("연결 해제");
// });

// //home.pug에 있는 요소들 관련
// const messageList = document.querySelector("ul");

// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");

// function makeMessage(type, payload) {
//     const msg = { type, payload };
//     return JSON.stringify(msg);
// }

// //home의 submit 이벤트 캐치시 input의 데이터들을 socket으로 보내고 내용을 비운다.
// messageForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const input = messageForm.querySelector("input");
//     socket.send(makeMessage("new_message", input.value));
//     input.value = "";
// });

// nickForm.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const input = nickForm.querySelector("input");
//     socket.send(makeMessage("nickname", input.value));
// });
//
//위 코드는 socket IO 안쓰고 구현--------------------------------------------------------------------------------------

const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

let roomName; //자신이 들어가있는 방이름
room.hidden = true; // 방에들어가면 방들어가는 것과 채팅창 변경

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("누군가 채팅에 들어왔습니다.");
});

socket.on("bye", () => {
  addMessage("누군가 채팅에서 나갔습니다.");
});

socket.on("new_message", addMessage);