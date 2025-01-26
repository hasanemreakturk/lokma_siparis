const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Branch = require('./Branch');
const Product = require('./Product');
const Category = require('./Category');

const DailySales = sequelize.define('DailySales', {
    daily_sales_id : {
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
        allowNull: true
    },
    quantity_amount: {
        type: DataTypes.FLOAT,
        allowNull:true
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {  
    tableName: 'daily_sales',
    timestamps: true,
});

DailySales.belongsTo(Branch, { foreignKey: 'branch_id' });
DailySales.belongsTo(Product, { foreignKey: 'product_id' });


module.exports = DailySales;
