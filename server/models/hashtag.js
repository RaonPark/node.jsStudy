const Sequelize = require('sequelize');

/* 
    TABLE HASHTAG {
        HASHTAG:
    }
*/

module.exports = class Hashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            tag: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    
    static associate(db) {
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    }
}