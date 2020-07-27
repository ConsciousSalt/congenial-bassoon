const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define(
    'product',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING, 
            allowNull: false
        },
        price: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        imageURL: Sequelize.STRING,
        description: Sequelize.STRING 
    }
);

module.exports = Product;