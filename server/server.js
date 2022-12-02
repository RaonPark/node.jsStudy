const express = require("express");
const indexRouter = require('./router');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const { sequelize } = require('./models');
const passport = require('passport');
const dotenv = require('dotenv');
const passportConfig = require('./passport');
const cookieParser = require("cookie-parser");
const AuthRouter = require('./router/auth');
const cors = require('cors');
const ProfileRouter = require('./router/profile');
const PostRouter = require('./router/post');
const FollowRouter = require('./router/follow');
const DirectMessageRouter = require('./router/directMessage');
const webSocket = require('./socket');

const root = path.join(__dirname, '../client/build');

dotenv.config();
const app = express();
passportConfig();

app.set('port', process.env.PORT || 8023);

app.use(morgan('dev'));
app.use(express.static(root));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: "http://localhost:10023" }));

const webSession = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
})
app.use(webSession);

app.use(passport.initialize());
app.use(passport.session());

sequelize.sync({ force: false })
.then(() => {
    console.log("데이터 베이스 연결완료");
})
.catch((err) => {
    console.log(`데이터 베이스 연결 실패: ${err}`);
});

app.use("/", indexRouter);
app.use("/account", AuthRouter);
app.use("/profile", ProfileRouter);
app.use("/post", PostRouter);
app.use("/follow", FollowRouter);
app.use("/directMessage", DirectMessageRouter);
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
})

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500);
    next();
});

const server = app.listen(app.get('port'), () => console.log(`${app.get('port')}에서 대기중`));

webSocket(server, app, webSession);

module.exports = app;