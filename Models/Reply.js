const sequelize = require("../Utils/Context");
const Sequelize = require("sequelize");

const Reply = sequelize.define('reply', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Reply;