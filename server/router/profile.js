const express = require('express');
const { isLoggedIn } = require('./helper');
const router = express.Router();

router.get("/getProfile.do", isLoggedIn, (req, res) => {
    res.send({OK: true, User: req.user});
});

module.exports = router;