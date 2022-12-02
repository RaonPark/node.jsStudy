const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/user');
const {isLoggedIn} = require('./helper');

const router = express.Router();

router.post("/getUserList.do", async (req, res) => {
    const users = await User.findAll({
        where: {
            [Op.not] : [{id: req.user.id}]
        }
    });

    const followerIdList = req.user.Followee.map(f => f.id);

    res.send({users: users, followerIds: followerIdList});
});

router.post("/follow.do", async (req, res) => {
    console.log("here", req.body.id);
    
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user) {
            await user.addFollowee(parseInt(req.body.id, 10));
            res.send({OK: true});
        } else {
            res.send({OK: false});
        }
    } catch(err) {
        res.send({OK: false});
    }
});

router.post("/unfollow.do", async (req, res) => {
    console.log("here", req.body.id);
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user) {
            await user.removeFollowee(parseInt(req.body.id, 10));
            res.send({OK: true});
        } else {
            res.send({OK: false});
        }
    } catch(err) {
        res.send({OK: false});
    }
});

router.post("/getFollower.do", async (req, res) => {
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user) {
            const follower = await user.getFollowee();
            res.send({OK: true, follower: follower});
        }
    } catch(err) {
        console.log(err);
        res.send({OK: false});
    }
});

module.exports = router;