const Request = require("../Models/Request");
const Events = require("../Models/Events");

exports.GetEventsPage = (req, res) => {
    const { invitations } = req.query;
    console.log(invitations);
    const user = req.session.User;

    Events.findAll({ where: { userId: user.id } })
        .then(events => {
            events = events.map(el => el.dataValues);
            events = events.map(el => {
                return {
                    ...el,
                    date: new Date(el.date).toLocaleDateString("en-US"),
                }
            })

            Request.findAll({ where: { toId: user.id } })
                .then(requests => {
                    requests = requests.map(el => el.dataValues);
                    // console.log('notifications info', requests);
                    //Filter the comments and replies to be undes the right post and comments
                    res.render('Events/Main', {
                        home: true,
                        user,
                        notifications: requests.length || 0,
                        invits: invitations ? true : false,
                        events
                    })
                })
        })


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
        console.log('DATE ERROR');
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