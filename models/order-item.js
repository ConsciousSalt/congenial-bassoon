const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const OrdertItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER
    }
});

module.exports = OrdertItem;