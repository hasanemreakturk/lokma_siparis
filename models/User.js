const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Branch = require('./Branch');
const Role = require('./Role');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'user',
    timestamps: false,
});

User.belongsTo(Branch, { foreignKey: 'branch_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;
