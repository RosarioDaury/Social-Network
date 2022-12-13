const Router = require('express').Router();
const Controller = require('../Controllers/Friends.Controller');
const IsAuth = require('../Utils/Middleware/IsAuth');


Router.get('/friends', IsAuth, Controller.GetFriendsPage);
// Router.get('/add/friend', IsAuth, Controller.GetAddFriend);
Router.get('/delete/friend/:friend', IsAuth, Controller.DeleteFriend);
Router.post('/post/friend/request', IsAuth, Controller.SendFriendRequest);

module.exports = Router;