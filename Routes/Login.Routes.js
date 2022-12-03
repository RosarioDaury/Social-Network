const Router = require('express').Router();
const Controller = require('../Controllers/Login.Controller');

//All get routes for Login
Router.get('/', Controller.GetLoginPage);
Router.get('/login', Controller.LoginPage);
Router.get('/register', Controller.GetRegisterPage);
Router.get('/forgotpassword', Controller.GetForgotPasswordPage);

//All post routes for Login
Router.post('/post/login', Controller.PostLoginPage);
Router.post('/post/register', Controller.PostRegisterPage);
Router.post('/post/forgotpassword', Controller.PostForgotPasswordPage);

module.exports = Router;