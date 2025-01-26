const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Category = require('./Category');

const Prediction = sequelize.define('Prediction', {
    prediction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.INTEGER, // 1: Tatlı, 2: Pasta
        allowNull: false,
    },
    predicted_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'predictions',
    timestamps: false,
});

// İlişkiler
Prediction.belongsTo(Product, {
    foreignKey: 'product_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Prediction.belongsTo(Category, {
    foreignKey: 'category',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

module.exports = Prediction;
