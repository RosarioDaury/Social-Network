const Request = require("../Models/Request");
const Events = require("../Models/Events");
const User = require("../Models/User");
const Invitation = require("../Models/Invitation");

////Constant states from invitations//////
const YES = "Accepted";
const MAYBE = "Maybe";
const NOT = "Rejected";


exports.GetEventsPage = (req, res) => {
    const { invits } = req.query;

    const user = req.session.User;

    if (invits) {
        Invitation.findAll({ where: { userId: user.id }, include: [{ model: Events }] })
            .then(events => {
                events = events.map(el => el.dataValues);

                Request.findAll({ where: { toId: user.id } })
                    .then(requests => {
                        requests = requests.map(el => el.dataValues);

                        res.render('Events/Main', {
                            home: true,
                            user,
                            notifications: requests.length || 0,
                            invits: true,
                            events,
                            eventPage: true
                        })

                    })
            })
    } else {
        Events.findAll({ where: { userId: user.id } })
            .then(events => {
                events = events.map(el => el.dataValues);


                Request.findAll({ where: { toId: user.id } })
                    .then(requests => {
                        requests = requests.map(el => el.dataValues);

                        Invitation.findAll()
                            .then(invitations => {
                                invitations = invitations.map(el => el.dataValues);

                                // console.log('invitations', invitations);

                                res.render('Events/Main', {
                                    home: true,
                                    user,
                                    notifications: requests.length || 0,
                                    invits: false,
                                    events,
                                    invitations,
                                    eventPage: true
                                })
                            })

                    })
            })
    }



}

exports.PostCreateEvent = (req, res) => {
    let { name, date, location } = req.body;
    let userId = req.session.User.id;
    let today = new Date().toLocaleDateString();

    // console.log({ name, date, location });

    if (!name || !date || !location) {
        req.flash('EventsErrors', 'All Fields are require when creating an event');
        return res.redirect('/events');
    }

    date = new Date(date).getTime();
    today = new Date(today).getTime();


    if (date <= today) {
        req.flash('EventsErrors', 'Cannot create an event for a date already passed');
        return res.redirect('/events')
    }

    Events.create({
        name,
        date,
        location,
        userId
    })
        .then(result => {
            res.redirect('/events');
        })
        .catch(err => {
            console.log('[ERROR AT CREATING EVENT]', err);
            res.redirect('/events');
        })

}

exports.DeleteEvent = (req, res) => {
    const { eventId } = req.params;

    Events.destroy({ where: { id: eventId } })
        .then(result => {
            res.redirect('/events');
        })
}

exports.GetInvitePage = (req, res) => {
    const user = req.session.User;
    const { eventId } = req.params;

    const { id } = user;

    Request.findAll({ where: { toId: id } })
        .then(requests => {
            requests = requests.map(el => el.dataValues);

            Events.findOne({ where: { id: eventId } })
                .then(eventData => {
                    eventData = eventData.dataValues;
                    res.render('Events/Invite', {
                        home: true,
                        user,
                        eventData,
                        notifications: requests.length || 0,
                        eventPage: true
                    });

                })
        })



}

exports.PostInvitePage = (req, res) => {
    const currentUser = req.session.User;
    const { eventId, username } = req.body;

    User.findOne({ where: { username: username } })
        .then(user => {
            if (!user) {
                req.flash('InviteErrors', 'Invalid User to send invitation to');
                return res.redirect(`/invite/event/${eventId}`);
            }
            user = user.dataValues;

            console.log({ friends: JSON.parse('[' + currentUser.friends + ']'), user: user.id })

            if (!JSON.parse('[' + currentUser.friends + ']').includes(user.id)) {
                req.flash('InviteErrors', 'Invalid User to send invitation to');
                return res.redirect(`/invite/event/${eventId}`);
            }

            Invitation.create({
                state: 'Not Response',
                userId: user.id,
                eventId: eventId
            })
                .then(result => {
                    res.redirect('/events');
                })

        })

}

exports.GetGuestList = (req, res) => {
    const { eventId } = req.params;
    const user = req.session.User;

    Invitation.findAll({ where: { eventId: eventId }, include: [{ model: User }] })
        .then(invitations => {
            invitations = invitations.map(el => el.dataValues);
            console.log('[LINE 166]', invitations);

            Request.findAll({ where: { toId: user.id } })
                .then(requests => {
                    requests = requests.map(el => el.dataValues);

                    res.render('Events/Guests', {
                        home: true,
                        user,
                        notifications: requests.length || 0,
                        invitations,
                        eventPage: true
                    })

                })


        })
}

exports.AcceptInvitation = (req, res) => {
    const { invitationId } = req.params;

    Invitation.update({ state: YES }, { where: { id: invitationId } })
        .then(result => {
            res.redirect('/Events?invits=true')
        })
        .catch(err => {
            console.log('[ERROR AT UPDATING INVITATION STATE]', err);
        })
}

exports.MaybeInvitation = (req, res) => {
    const { invitationId } = req.params;

    Invitation.update({ state: MAYBE }, { where: { id: invitationId } })
        .then(result => {
            res.redirect('/Events?invits=true')
        })
        .catch(err => {
            console.log('[ERROR AT UPDATING INVITATION STATE]', err);
        })
}

exports.RejectInvitation = (req, res) => {
    const { invitationId } = req.params;

    Invitation.update({ state: NOT }, { where: { id: invitationId } })
        .then(result => {
            res.redirect('/Events?invits=true')
        })
        .catch(err => {
            console.log('[ERROR AT UPDATING INVITATION STATE]', err);
        })
}