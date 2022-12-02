const passport = require('passport');
const User = require('../models/user');
const local = require('./localStrategy');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'userId'],
                as: 'Follower',
            }, {
                model: User,
                attributes: ['id', 'userId'],
                as: 'Followee',
            }] 
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    });

    local();
}