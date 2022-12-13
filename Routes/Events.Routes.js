const Router = require('express').Router();
const Controller = require('../Controllers/Events.Controller');
const IsAuth = require('../Utils/Middleware/IsAuth');

Router.get('/events', IsAuth, Controller.GetEventsPage);
Router.post('/post/create/event', IsAuth, Controller.PostCreateEvent);


module.exports = Router;