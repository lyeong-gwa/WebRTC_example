# WebRTC_example
노마드코더 실습 webrtc 기능구현

1.zoom폴더 생성후 npm 초기화, package.json에 main과 scripts영역 삭제
npm init -y


2.npm i nodemon -D 설치하기

3.nodemon.json, babel.config.json src/server.js 생성하기

4.npm i @babel/core @babel/cli @babel/node @babel/preset-env -D

5.nodemon.json에 다음 내용을 추가 : nodemon 실행시 babel-node로 src/server.js를 수행한다.
{
    "exec" : "babel-node src/server.js"
}

6.babel.config.json에 다음 내용을 추가
{
    "presets" : ["@babel/preset-env"]
}

7.package.json에 scripts 내용 추가
{
    "dev" : "nodemon"
},

8.npm i express 

9.npm i pug

10.server.js 내용추가
import express from "express";
const app = express();
console.log("hello");
app.listen(3000);

---------------------------------------------

1.src안에 public, views 폴더 생성 
public/js/app.js
alert("hi");


views/home.pug
doctype html
html(lang="en")
    head
        meta(charset="UTF-8")
        meta(http-equiv="X-UA-Compatible", content="IE=edge")
        meta(name="viewport", content="width=device-width, initial-scale=1.0")
        title Noom
        link(rel="stylesheet", href="https://unpkg.com/mvp.css")
    body
        header
            h1 Noom
        main
            h2 Welcome to Noom
        script(src="/public/js/app.js") 

server.js
import express from "express";
const app = express();
console.log("hello");

//app.listen(3000);

app.set("view engine", "pug"); //뷰 엔진 pug 명시
app.set("views", __dirname + "/views"); // views폴더를 현재 디렉터리/views로
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home")); //home.pug로 

const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000, handleListen);

2.nodemon.js 내용추가
"ignore":["src/public/*"], 
이것은 해당 폴더의 내용물은 파일내용이 바뀌어도 nodemon에 실시간 적용x



npm i localtunnel 설치 후 lt --port 3000 수행하면 일시적인 도메인 획득가능