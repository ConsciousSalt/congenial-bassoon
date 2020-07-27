const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-shop', 
                                    'root', 
                                    'hb4gj1zYJf1uFP6yH', 
                                        {dialect: 'mysql', 
                                        host: 'localhost'}
                                );
module.exports = sequelize;