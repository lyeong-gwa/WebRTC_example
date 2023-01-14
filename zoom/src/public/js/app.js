//브라우저 역할
//alert("hi");
const socket = new WebSocket(`ws://${window.location.host}`); //그냥 http://localhost하면 안됨
socket.addEventListener("open", () => {
    console.log("연결 시작");
})
socket.addEventListener("message", (message) => {
    console.log("메세지: ", message.data);
});
socket.addEventListener("close", () => {
    console.log("연결 해제");
});


//home.pug에 있는 요소 커넥
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

//home의 submit 이벤트 캐치시 input의 데이터들을 socket으로 보내고 내용을 비운다.
messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(input.value);
    input.value = "";
});