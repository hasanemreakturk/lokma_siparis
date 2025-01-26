const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Branch = require('./Branch');
const Product = require('./Product');

const DailyOrder = sequelize.define('DailyOrder', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kg_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    quantity_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'daily_order',
    timestamps: true,
});

DailyOrder.belongsTo(Branch, { foreignKey: 'branch_id' });
DailyOrder.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = DailyOrder;
