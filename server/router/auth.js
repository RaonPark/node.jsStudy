const express = require('express');
const User = require('../models/user');
const { Op } = require('sequelize');
const { isNotLoggedIn, isLoggedIn, getEncryptedPassword, randomGenerator, smtpTransport } = require('./helper');
const passport = require('passport');
const nodemailer = require("nodemailer");
const Email = require("../models/email");

const router = express.Router();

router.post("/login.do", isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.log(authError);
            res.send({OK: false, msg: "error"});
            return next(authError);
        }
        if(!user) {
            return res.send({OK: false, msg: info.message});
        }
        return req.login(user, (loginError) => {
            if(loginError) {
                res.send({OK: false, msg: "error"});
                return next(loginError);
            } 
            return res.send({OK: true});
        });
    })(req, res, next);
});

router.post("/isLoggedIn.do", (req, res, next) => {
    if(req.user) {
        res.send({isLoggedIn : true});
    } else {
        res.send({isLoggedIn : false});
    }
});

router.post("/isVerified.do", async (req, res) => {
    const isVerified = await User.findOne({
        attributes: ['verified'],
        where: { id: req.user.id },
    });

    res.send({isVerified: isVerified});
});

router.post("/getVerifyCode.do", (req, res) => {
    const code = randomGenerator();
    const email = req.user.email;
    console.log(email);

    const mailOptions = {
        from: "슈스타그램",
        to: email,
        subject: "슈스타그램에서 인증코드를 보냈습니다.",
        text: code
    };

    const result = smtpTransport.sendMail(mailOptions, async (err, response) => {
        console.log(response);
        console.log(err);
        const emailCode = await Email.create({
            verifyCode: code,
            UserId: req.user.id
        });
        smtpTransport.close();
    });

    res.send({OK: true});
});

router.post("/deleteVerifyCode.do", (req, res) => {
    Email.destroy({
        where: { UserId: req.user.id }
    });
    res.send({OK: true});
});

router.post("/verifyEmail.do", async (req, res) => {
    const exData = await Email.findOne({
        where: {[Op.and] : [ { verifyCode: req.body.code }, { UserId: req.user.id } ]}
    });

    if(!exData) {
        res.send({OK: false});
        return;
    } else {
        Email.destroy({
            where: {[Op.and] : [ { verifyCode: req.body.code }, { UserId: req.user.id } ]}
        }).then(async (response) => {
            await User.update({
                verified: true
            }, {
                where: { id: req.user.id }
            });
        });
        res.send({OK: true});
    }
});

router.post("/register.do", isNotLoggedIn, async (req, res, next) => {
    const { email, userId, username, password } = req.body;
    console.log(email, userId, username, password);
    try {
        const exUser = await User.findOne({ where : { email }});
        if(exUser) {
            res.send({OK: false, msg: "이메일 중복"});
            return ;
        }
        const encrypted = await getEncryptedPassword(password);
        console.log(encrypted);
        await User.create({
            email: email,
            userId: userId,
            username: username,
            password: encrypted
        });
        res.status(201).send({OK: true});
    } catch(err) {
        console.log(err);
        res.status(201).send({OK:false, msg: "에러 발생"});
    } finally {
        next();
    }
});

router.get("/logout.do", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send({OK: true});
});

router.post("/getUserId.do", isLoggedIn, (req, res) => {
    res.send({userId: req.user.userId});
});

router.post("/getUser.do", isLoggedIn, (req, res) => {
    res.send({user: req.user});
})

router.post("/isDuplicates.do", isNotLoggedIn, async (req, res) => {
    const exUser = await User.findOne({
        where: { 
            [Op.or]: 
            [{ email: req.body.email }, { userId: req.body.userId }] 
        }
    });

    if(!exUser) {
        res.send({OK: true});
    } else {
        res.send({OK: false});
    }
})

module.exports = router;