const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {
    branch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    tableName: 'branch',
    timestamps: false,
});

module.exports = Branch;
