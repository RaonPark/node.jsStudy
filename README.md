# 개인 SNS 페이지

## 기술 스택

* 백엔드 - Node.js 
* 프론트엔드 - React + Javascript
* MaterialUI - 페이지 UI
* Axios - 프론트엔드에서 백엔드로 요청을 보내기 위해 사용
* passport - 로그인을 구현하기 위해 사용
* socket-io - 다이렉트 메시지(DM)을 구현하기 위해 사용
* nodemailer - 이메일 인증을 구현하기 위해 사용 
* mysql2 - MySQL을 사용하기 위해 사용
* multer - 업로드한 파일을 서버에 저장하기 위해 사용

***

## 각 폴더 별 설명

* models - MySQL 모델 코드
* passport - passport 관련 코드
* router - router 관련 코드
* uploads - 업로드한 파일을 multer로 저장한 파일이 있는 폴더
* server.js, socket.js - 각각 서버 코드와 socket-io 코드

***

## 라우터 별 동작 방식 설명

