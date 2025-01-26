const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Branch = require('./Branch');
const Product = require('./Product');

const MonthlySales = sequelize.define('MonthlySales', {
    monthly_sales_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    profit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kg_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    porsion_amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'monthly_sales',
    timestamps: true,
});

MonthlySales.belongsTo(Branch, { foreignKey: 'branch_id' });

module.exports = MonthlySales;
