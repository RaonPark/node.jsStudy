const Sequelize = require('sequelize');

module.exports = class DirectMessage extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            message: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'DirectMessage',
            tableName: 'directmessages',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    
    static associate(db) {
        db.DirectMessage.belongsTo(db.User, { foreignKey: 'from', targetKey: 'id' });
        db.DirectMessage.belongsTo(db.User, { foreignKey: 'to', targetKey: 'id' });
    }
}