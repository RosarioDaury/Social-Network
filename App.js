/////////////////////RUN USING THE COMMAND "npm run dev"////////////////////////

//Area for regular imports
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./Utils/Context');
//MODELS////////////////////////////////////////////////////////
const User = require('./Models/User');
const Publication = require('./Models/Publication');
const Comment = require('./Models/Comment');
const Reply = require('./Models/Reply');
const Request = require('./Models/Request');
////////////////////////////////////////////////////////////////////

//ENVIROMENT VARIABLES
require('dotenv').config();

const App = express();
App.use(express.urlencoded({ extended: false }));

App.engine('hbs', handlebars.engine({
    layoutsDir: 'Views/Layout/',
    defaultLayout: 'Layout',
    extname: 'hbs',
}));


App.set('view engine', "hbs");
App.set('views', 'views');


//Entities Relationships
Publication.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
Comment.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
Reply.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
Request.belongsTo(User, { constraint: true, onDelete: "CASCADE" });

User.hasMany(Publication);
User.hasMany(Comment);
User.hasMany(Reply);
User.hasMany(Request);



//Init ORM [CHECK CONSOLE FOR QUERIES]
sequelize.sync()
    .then(() => {
        App.listen(process.env.PORT, () => {
            console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
        console.log('[ERROR] CANNOT SYNC THE MODELS');
    })

/////////////////////RUN USING THE COMMAND "npm run dev"////////////////////////



