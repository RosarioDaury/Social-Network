const sequelize = require("../Utils/Context");
const Sequelize = require("sequelize");

const Request = sequelize.define('request', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }
})

module.exports = Request;