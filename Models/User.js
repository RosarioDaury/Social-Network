const sequelize = require("../Utils/Context");
const Sequelize = require("sequelize");

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    friends: {
        type: Sequelize.JSON,
        allowNull: true,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    confirmCode: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = User;