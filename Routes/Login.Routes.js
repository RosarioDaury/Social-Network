const Router = require('express').Router();
const Controller = require('../Controllers/Login.Controller');

Router.get('/', Controller.GetLoginPage);
Router.get('/login', Controller.LoginPage);
Router.get('/register', Controller.GetRegisterPage);

module.exports = Router;