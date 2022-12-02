const express = require('express');
const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
    console.log("hello");
    console.log(path.join(__dirname, "../../client/build/index.html"));
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Follower.length : 0;
    res.locals.followeeCount = req.user ? req.user.Followee.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followee.map(f => f.id) : [];
    next();
});

module.exports = router;