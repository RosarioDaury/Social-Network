const Router = require('express').Router();
const Controller = require('../Controllers/Home.Controller');
const IsAuth = require('../Utils/Middleware/IsAuth');

Router.get('/Home', IsAuth, Controller.GetHomePage);
Router.post('/post/post', IsAuth, Controller.PostForPost);
Router.post('/post/comment/:publication', IsAuth, Controller.PostComment);
Router.post('/post/reply/:comment', IsAuth, Controller.PostReply);
Router.get('/delete/post/:id', IsAuth, Controller.DeletePost);
Router.get('/edit/post/:id', IsAuth, Controller.GetEditPost);
Router.post('/post/edit', IsAuth, Controller.PostEditPost);

module.exports = Router;