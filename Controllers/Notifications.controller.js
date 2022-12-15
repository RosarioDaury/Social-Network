const Request = require("../Models/Request");
const User = require("../Models/User");

exports.GetRequestsPage = (req, res) => {
    const user = req.session.User;
    const { id } = user;
    Request.findAll({ where: { toId: id }, include: { model: User, as: 'from' } })
        .then(requests => {
            requests = requests.map(el => el.dataValues);
            // console.log('notifications info', requests);
            res.render('Notifications/Main', { home: true, user, requests, notifications: requests.length || 0, notificationsPage: true })
        })
}

exports.AcceptFriendRequest = (req, res) => {
    const { id } = req.params;

    Request.findOne({ where: { id: id } })
        .then(request => {
            request = request.dataValues;
            // console.log('Accept Request', request);
            User.findOne({ where: { id: request.fromId } })
                .then(user => {
                    user = user.dataValues;
                    let friends = JSON.parse("[" + user.friends + "]").filter(el => el !== null);
                    // console.log('OLD FRIENDS LIST', friends);
                    friends.push(request.toId);

                    User.update({ friends: friends.join(', ') }, { where: { id: user.id } })
                        .then(result => {
                            Request.destroy({ where: { id: request.id } })
                                .then(result => {
                                    res.redirect('/notifications');
                                })
                                .catch(err => {
                                    console.log('[ERROR AT DELETING REQUEST AFTER ACCEPTED]', err)
                                    res.redirect('/notifications');
                                })
                        })
                        .catch(err => {
                            console.log('[ERROR AT UPDATING FRIENDS LIST]', err)
                            res.redirect('/notifications');
                        })
                })
        })
        .catch(err => {
            console.log('[ERROR AT ACCEPTING FRIEND REQUEST]', err);
        })
}


exports.RejectFriendRequest = (req, res) => {
    const { id } = req.params;

    Request.destroy({ where: { id: id } })
        .then(result => {
            res.redirect('/notifications');
        })
        .catch(err => {
            console.log('[ERROR AT DELETING FRIEND REQUEST]', err);
            res.redirect('/notifications');
        })
}