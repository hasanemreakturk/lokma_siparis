// models/index.js
const Branch = require('./Branch');
const Category = require('./Category');
const DailyOrder = require('./DailyOrder');
const DailyProduction = require('./DailyProduction');
const DailySales = require('./DailySales');
const MonthlySales = require('./MonthlySales');
const Product = require('./Product');
const Role = require('./Role');
const Stock = require('./Stock');
const User = require('./User');
const Prediction = require('./Prediction');

module.exports = {
  Branch,
  Category,
  DailyOrder,
  DailyProduction,
  DailySales,
  MonthlySales,
  Product,
  Role,
  Stock,
  User,
  Prediction,
};