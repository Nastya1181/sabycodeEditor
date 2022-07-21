const {Sequelize} = require('sequelize');

// данные для подключения к базе данных

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER, // пользователь
    process.env.DB_PASSWORD, // пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)