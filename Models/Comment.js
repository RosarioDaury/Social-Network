const sequelize = require("../Utils/Context");
const Sequelize = require("sequelize");

const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

module.exports = Comment;