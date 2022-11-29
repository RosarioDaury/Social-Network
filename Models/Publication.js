const sequelize = require("../Utils/Context");
const Sequelize = require("sequelize");

const Publication = sequelize.define('publication', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: true,
    },
})

module.exports = Publication;