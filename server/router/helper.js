const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.getEncryptedPassword = (password) => (
    new Promise((resolve, reject) => {
        const salt = process.env.SALT;

        crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
            resolve(key.toString('base64'));
        });
    })
);

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.status(403).send("로그인한 상태입니다.");
    }
}

exports.smtpTransport = nodemailer.createTransport({
    port: 587,
    host: 'smtp.gmail.com',
    service: 'Gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.randomGenerator = () => {
    const randAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'S', 'T', 'R', 'V', 'W', 'X', 'Y', 'Z'];
    const randNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let code = "";

    for(let i = 0; i < 4; i++) {
        const alphaNum = Math.round(Math.random());
        if(alphaNum === 0) {
            const randIdx = Math.floor(Math.random() * randAlpha.length);
            code += randAlpha[randIdx];
        } else {
            const randIdx = Math.floor(Math.random() * randNum.length);
            code += randNum[randIdx];
        }
    }

    return code;
}