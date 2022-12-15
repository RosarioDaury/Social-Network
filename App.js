/////////////////////RUN USING THE COMMAND "npm run dev"////////////////////////

//Area for regular imports
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./Utils/Context');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

//MODELS////////////////////////////////////////////////////////
const User = require('./Models/User');
const Publication = require('./Models/Publication');
const Comment = require('./Models/Comment');
const Reply = require('./Models/Reply');
const Request = require('./Models/Request');
const Invitation = require('./Models/Invitation');
const Event = require('./Models/Events');

////////////////////////////////////////////////////////////////////

////HBS Helpers
const HasPhoto = require('./Utils/HbsHelpers/HasPhoto');
const IfEqual = require('./Utils/HbsHelpers/IfEqual');
const CountInvitations = require('./Utils/HbsHelpers/CountInvitations');
const FormatDate = require('./Utils/HbsHelpers/FormatDate');
const CompareDate = require('./Utils/HbsHelpers/CompareDates');
const CompareString = require('./Utils/HbsHelpers/CompareString');


///////////////////////////////Import Routers///////////////////////////////////////
const LoginRouter = require('./Routes/Login.Routes');
const HomeRouter = require('./Routes/Home.Routes');
const FriendsRouter = require('./Routes/Friends.Routes');
const NotificationsRouter = require('./Routes/Notifications.Routes');
const EventsRouter = require('./Routes/Events.Routes');


/////////////////////////////////ENVIROMENT VARIABLES//////////////////////////////////////
require('dotenv').config();

const App = express();
App.use(cookieParser());
App.use(flash());
App.use(express.urlencoded({ extended: false }));
App.use(express.static(path.join(__dirname, 'public')));


App.engine('hbs', handlebars.engine({
    layoutsDir: 'Views/Layout/',
    defaultLayout: 'Layout',
    extname: 'hbs',
    helpers: {
        HasPhoto,
        IfEqual,
        CountInvitations,
        FormatDate,
        CompareDate,
        CompareString,
    }
}));

//////////////Multer SETUP///////////////////////////

const forFiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`)
    }
})


App.use(multer({ storage: forFiles }).single('image'))

//Static files location



////////////////////////////////////////////////////


///Set sesssions////////////////////////
App.use(session({
    secret: 'MySecretKey',
    resave: false,
    saveUninitialized: true,
}))
/////////////////////////////////////////

App.set('view engine', "hbs");
App.set('views', 'views');

////Middleware to check if user is logged/////////////////

App.use((req, res, next) => {
    const registerErrors = req.flash('RegisterErrors');

    const loginErrors = req.flash('LoginErrors');

    const ForgotPasswordErrors = req.flash('ForgotPasswordErrors')

    const publishErrors = req.flash('PublishErrors');

    const friendsErrors = req.flash('FriendsErrors');
    const friendsSuccess = req.flash('FriendsSuccess');

    const eventsErrors = req.flash('EventsErrors')

    const inviteErrors = req.flash('InviteErrors');


    res.locals.isAuth = req.session.isAuth;
    res.locals.User = req.session.User;

    // console.log('User', req.session.User);

    //Errros for Register Page
    res.locals.RegisterErrors = registerErrors;
    res.locals.hasRegisterErrors = registerErrors.length > 0;

    //Error for Login Page
    res.locals.LoginErrors = loginErrors;
    res.locals.hasLoginErrors = loginErrors.length > 0;

    //Error for Login Page
    res.locals.ForgotPasswordErrors = ForgotPasswordErrors;
    res.locals.hasForgotPasswordErrors = ForgotPasswordErrors.length > 0;

    //Error for publishing a post
    res.locals.PublishErrors = publishErrors;
    res.locals.hasPublishErrors = publishErrors.length > 0;

    //Error for Friend's page a post
    res.locals.FriendsErrors = friendsErrors;
    res.locals.hasFriendsErrors = friendsErrors.length > 0;

    //Success for Friend's page a post
    res.locals.FriendsSuccess = friendsSuccess;
    res.locals.hasFriendsSuccess = friendsSuccess.length > 0;

    //Error for Event's page
    res.locals.EventsErrors = eventsErrors;
    res.locals.hasEventsErrors = eventsErrors.length > 0;

    //Error for Event's page
    res.locals.InviteErrors = inviteErrors;
    res.locals.hasInviteErrors = inviteErrors.length > 0;

    next();
})

////Set Routes to the APP/////////////////////
App.use(LoginRouter);
App.use(HomeRouter);
App.use(FriendsRouter);
App.use(NotificationsRouter);
App.use(EventsRouter);
///////////////////////////////////////////////////

////////////////////////Entities Relationships//////////////////////////////////////////////////
Publication.belongsTo(User, { constraint: true, onDelete: "CASCADE" });

Comment.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
Comment.belongsTo(Publication, { constraint: true, onDelete: "CASCADE" });

Reply.belongsTo(User, { constraint: true, onDelete: "CASCADE" });
Reply.belongsTo(Comment, { constraint: true, onDelete: "CASCADE" });

Request.belongsTo(User, { constraint: true, onDelete: "CASCADE", as: 'to', foreignKey: 'toId' });
Request.belongsTo(User, { constraint: true, onDelete: "CASCADE", as: 'from', foreignKey: 'fromId' });

Event.belongsTo(User, { constraint: true, onDelete: 'CASCADE' })

Invitation.belongsTo(User, { constraint: true, onDelete: 'CASCADE' })
Invitation.belongsTo(Event, { constraint: true, onDelete: 'CASCADE' })


User.hasMany(Publication);
User.hasMany(Comment);
User.hasMany(Reply);
User.hasMany(Request);
User.hasMany(Event);
User.hasMany(Invitation);

//////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////Init ORM [CHECK CONSOLE FOR QUERIES]/////////////////////////////////////////
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



