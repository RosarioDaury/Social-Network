const Router = require('express').Router();
const Controller = require('../Controllers/Notifications.Controller');
const IsAuth = require('../Utils/Middleware/IsAuth');

Router.get('/notifications', IsAuth, Controller.GetRequestsPage);
Router.get('/accept/friend/:id', IsAuth, Controller.AcceptFriendRequest);
Router.get('/reject/friend/:id', IsAuth, Controller.RejectFriendRequest);

module.exports = Router;