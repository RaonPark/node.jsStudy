const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
            },
            username: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            userId: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            verified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.DirectMessage, { foreignKey: 'from', sourceKey: 'id' });
        db.User.hasMany(db.DirectMessage, { foreignKey: 'to', sourceKey: 'id' });
        db.User.belongsToMany(db.User, { foreignKey: 'followeeId', as: 'Followee', through: 'Follow' });
        db.User.belongsToMany(db.User, { foreignKey: 'followerId', as: 'Follower', through: 'Follow' });
        db.User.hasOne(db.Email);
    }
}