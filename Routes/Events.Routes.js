const Router = require('express').Router();
const Controller = require('../Controllers/Events.Controller');
const IsAuth = require('../Utils/Middleware/IsAuth');

Router.get('/events', IsAuth, Controller.GetEventsPage);
Router.post('/post/create/event', IsAuth, Controller.PostCreateEvent);
Router.get('/invite/event/:eventId', IsAuth, Controller.GetInvitePage);
Router.post('/post/invite/event', IsAuth, Controller.PostInvitePage);
Router.get('/guests/list/:eventId', IsAuth, Controller.GetGuestList);

Router.get('/accept/invitation/:invitationId', IsAuth, Controller.AcceptInvitation);
Router.get('/maybe/invitation/:invitationId', IsAuth, Controller.MaybeInvitation);
Router.get('/reject/invitation/:invitationId', IsAuth, Controller.RejectInvitation);

Router.get('/delete/event/:eventId', IsAuth, Controller.DeleteEvent);



module.exports = Router;