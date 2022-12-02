'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const User = require('./user');
const Hashtag = require('./hashtag');
const Post = require('./post');
const DirectMessage = require('./directMessage');
const Email = require('./email');

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Hashtag = Hashtag;
db.Post = Post;
db.DirectMessage = DirectMessage;
db.Email = Email;

User.init(sequelize);
Hashtag.init(sequelize);
Post.init(sequelize);
DirectMessage.init(sequelize);
Email.init(sequelize);

User.associate(db);
Hashtag.associate(db);
Post.associate(db);
DirectMessage.associate(db);
Email.associate(db);

module.exports = db;
