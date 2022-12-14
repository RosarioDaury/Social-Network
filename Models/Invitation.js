const sequelize = require("../Utils/Context");
const Sequelize = require("sequelize");

const Invitation = sequelize.define('invitation', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    state: {
        type: Sequelize.STRING,
        allowNull: true,
    },
})

module.exports = Invitation;