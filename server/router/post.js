const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const Post = require('../models/post');
const Hashtag = require('../models/hashtag');
const {isLoggedIn} = require('./helper');
const {v5} = require('uuid');
const User = require('../models/user');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch(err) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
});

router.post('/img.do', isLoggedIn, upload.array('images'), (req, res) => {
    let urls = [];
    for(const file of req.files) {
        urls.push(`/img/${file.filename}`);
    }
    res.send({ url: urls });
});

const upload2 = multer();

router.post("/upload.do", isLoggedIn, upload2.none(), async(req, res, next) => {
    console.log(req.body.images);
    
    const images = req.body.images;
    let urls = "";
    for(let index = 0; index < images.length; index++) {
        urls += `${images[index]};`;
    }

    console.log(urls);
    try {
        const hashtags = req.body.article.match(/#[^\s#]+/g);
        console.log("hashtags: ", hashtags);
        
        const post = await Post.create({
            image: urls,
            article: req.body.article,
            UserId: req.user.id,
        });
        if(hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { tag: tag.slice(1).toLowerCase() },
                    })
                }),
            );

            await post.addHashtags(result.map(r => r[0]));
        }
        res.send({OK: true});
    } catch(error) {
        next(error);
    }
    
   res.send({OK: true});
});

router.post("/getPosts.do", async (req, res) => {
    const posts = await Post.findAll({
        include: [{
            model: User,
        }]
    });

    res.send({posts: posts});
});

router.post("/edit.do", async (req, res) => {
    const images = req.body.images;
    let urls = "";
    for(let index = 0; index < images.length; index++) {
        urls += `${images[index]};`;
    }

    const response = await Post.update({
        image: urls,
        article: req.body.article,
        UserId: req.user.id
    }, {
        where: { id: req.body.id }
    });

    res.send({OK: true});
});

router.post("/delete.do", async (req, res) => {
    const response = await Post.destroy({
        where: { id: req.body.id }
    });

    res.send({OK: true});
})

module.exports = router;