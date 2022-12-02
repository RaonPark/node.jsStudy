const express = require('express');
const DirectMessage = require('../models/directMessage');
const User = require('../models/user');
const {Op} = require('sequelize');

const router = express.Router();

router.post("/room/:id", async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.body.id }});
        const io = req.app.get('io');
        if(user) {
            const { room } = io.of('/chat').adapter;
            const msg = await DirectMessage.findAll({
                where: {
                    [Op.and]: [
                        { [Op.or]: [{from: req.body.id}, {from: req.user.id}] },
                        { [Op.or]: [{to: req.body.id}, {to: req.user.id}]},
                    ]
                },
                order: [
                    ['createdAt', 'ASC'],
                ]
            });
            await DirectMessage.update({
                isRead: true,
            }, { 
                where: {
                    [Op.and]: [
                        { [Op.or]: [{from: req.body.id}, {from: req.user.id}] },
                        { [Op.or]: [{to: req.body.id}, {to: req.user.id}]},
                    ]
            }});
           res.send({OK: true, msg});
        } else {
            res.send({OK: false});
        }
    } catch(err) {
        console.log(err);
        res.send({OK: false});
    }
});

router.post('/room/:id/dm', async(req, res, next) => {
    try {
        console.log(req.body.id);
        const msg = await DirectMessage.create({
            message: req.body.msg,
            isRead: false,
            from: req.user.id,
            to: req.body.id
        });
        req.app.get('io').of('/dm').to(req.body.id).emit('dm', msg);
        res.send({OK: true, msg: msg});
    } catch(err) {
        console.log(err);
        res.send({OK: false});
    }
});

router.post("/getUnreadMsg.do", async (req, res) => {
    try {
        const count = await DirectMessage.count({col: 'id', 
        where: {
            [Op.and]: [
                { to: req.user.id },
                { isRead: false },
            ]
        }});
        res.send({OK: true, count});
    } catch(err) {
        console.log(err);
        res.send({OK: false});
    }
});

module.exports = router;