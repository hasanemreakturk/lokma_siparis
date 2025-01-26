const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MonthlyProduct = sequelize.define('MonthlyProduct', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'monthly_product',
  timestamps: false,
});

module.exports = MonthlyProduct;
