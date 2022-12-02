const Sequelize = require('sequelize');

module.exports = class Email extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            verifyCode: {
                type: Sequelize.STRING(5),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Email',
            tableName: 'emails',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Email.belongsTo(db.User);
    }
}