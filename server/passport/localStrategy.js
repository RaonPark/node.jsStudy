const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const crypto = require('crypto');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'password',
  }, async (userId, password, done) => {
    try {
      const exUser = await User.findOne({ where: { userId } });
      if (exUser) {
        const result = crypto.pbkdf2Sync(password, process.env.SALT, 100000, 64, 'sha512');
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
