const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Branch = require('./Branch');
const Product = require('./Product');

const Stock = sequelize.define('Stock', {
    stock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kg_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    quantity_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'stock',
    timestamps: true,
});

Stock.belongsTo(Branch, { foreignKey: 'branch_id' });
Stock.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = Stock;
