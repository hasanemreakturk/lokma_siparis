const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Branch = require('./Branch');
const Product = require('./Product');
const DailyOrder = require('./DailyOrder');

const DailyProduction = sequelize.define('DailyProduction', {
    production_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    produced_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    produced_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'daily_production',
    timestamps: true,
});

DailyProduction.belongsTo(Branch, { foreignKey: 'branch_id' });
DailyProduction.belongsTo(Product, { foreignKey: 'product_id' });


module.exports = DailyProduction;
