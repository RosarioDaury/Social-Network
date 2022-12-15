const Router = require('express').Router();
const Controller = require('../Controllers/Login.Controller');
const IsNotAuth = require('../Utils/Middleware/IsNotAuth');

//All get routes for Login
Router.get('/', Controller.GetLoginPage);
Router.get('/login', IsNotAuth, Controller.LoginPage);
Router.get('/register', Controller.GetRegisterPage);
Router.get('/forgotpassword', Controller.GetForgotPasswordPage);

//All post routes for Login
Router.post('/post/login', Controller.PostLoginPage);
Router.post('/post/register', Controller.PostRegisterPage);
Router.post('/post/forgotpassword', Controller.PostForgotPasswordPage);


Router.get('/confirmAccount/:code', Controller.ActivateAccount);

Router.get('/logout', Controller.LogOut);

module.exports = Router;