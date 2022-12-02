const Sequelize = require('sequelize');
const User = require('./user');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            article: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    }
}