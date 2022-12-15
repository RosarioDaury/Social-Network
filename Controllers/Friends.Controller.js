const Comment = require("../Models/Comment");
const Publication = require("../Models/Publication");
const Reply = require("../Models/Reply");
const Request = require("../Models/Request");
const User = require("../Models/User");
const friendRequest = 'Friend Request'

exports.GetFriendsPage = (req, res) => {
    const user = req.session.User;
    let friends = JSON.parse("[" + user.friends + "]");
    // console.log(friends, "User's Friends");
    // console.log(friends, "User's Friends");

    Publication.findAll({ where: { userId: friends }, include: [{ model: User }] })
        .then(publications => {
            publications = publications.map(el => el.dataValues);
            // console.log('publications', publications);
            Comment.findAll({ include: [{ model: User }], order: [['createdAt', 'DESC']] })
                .then(results => {
                    const comments = results.map(el => el.dataValues)
                    // console.log('comments', comments);

                    Reply.findAll({ include: [{ model: User }], order: [['createdAt', 'ASC']] })
                        .then(results => {

                            const replies = results.map(el => el.dataValues);

                            User.findAll({ where: { id: friends } })
                                .then(users => {
                                    users = users.map(el => el.dataValues);

                                    const { id } = user;
                                    Request.findAll({ where: { toId: id } })
                                        .then(requests => {
                                            requests = requests.map(el => el.dataValues);
                                            // console.log('notifications info', requests);
                                            //Filter the comments and replies to be undes the right post and comments
                                            res.render(
                                                'Friends/Main',
                                                {
                                                    publications,
                                                    user,
                                                    comments,
                                                    replies,
                                                    home: true,
                                                    users,
                                                    notifications: requests.length || 0,
                                                    friendsPage: true
                                                }
                                            )
                                        })

                                })



                        })
                })
        })

}

// exports.GetAddFriend = (req, res) => {
//     User.findAll()
//         .then(users => {
//             users = users.map(el => el.dataValues);
//             res.render('Friends/Add', { home: true, users });
//         })
// }

exports.DeleteFriend = (req, res) => {
    const { friend } = req.params;
    const user = req.session.User;
    let friends = JSON.parse("[" + user.friends + "]").filter(el => el !== Number(friend));
    friends = friends.length > 0 ? friends.join(', ') : null
    // console.log('friends after delete', friends);

    if (friend === user.id) return res.redirect('/friends');

    User.update(
        {
            friends
        },
        { where: { id: user.id } },

    )
        .then(result => {
            User.findOne({ where: { id: user.id } })
                .then(result => {
                    req.session.User = result.dataValues;
                    res.redirect('/friends');
                })
                .catch(err => {
                    console.log('[ERROR DELETING FRIEND]', err)
                })
        })
        .catch(err => {
            console.log('[ERROR DELETING FRIEND]', err)
        })


}

exports.SendFriendRequest = (req, res) => {
    const { friendsName } = req.body;
    const { username, id, friends } = req.session.User

    if (!friendsName) {
        req.flash('FriendsErrors', "Write a friend's Name");
        return res.redirect('/friends');
    }


    User.findOne({ where: { username: friendsName } })
        .then(to => {

            if (!to) {
                req.flash('FriendsErrors', 'Invalid User to send request to');
                return res.redirect('/friends');
            }

            to = to.dataValues;


            // console.log('FRIENDS LIST RIGHT HERE!!!', JSON.parse('[' + friends + ']'))
            if (JSON.parse('[' + friends + ']').includes(to.id)) {
                req.flash('FriendsErrors', ` ${friendsName} is already your friend`);
                return res.redirect('/friends');
            }

            if (friendsName === username) {
                req.flash('FriendsErrors', 'Cannot send a friend request to yourself');
                return res.redirect('/friends');
            }

            Request.create({
                type: friendRequest,
                userId: id,
                fromId: id,
                toId: to.id
            })
                .then(result => {
                    req.flash('FriendsSuccess', 'Friend Request succesfully sent');
                    // console.log('Friend', to.dataValues);
                    res.redirect('/friends');
                })
                .catch(err => {
                    console.log(['[ERROR CREATING FRIEND REQUEST]', err]);
                })
        })
        .catch(err => {
            console.log('[ERROR SENDING FRIEND REQUEST]', err);
            res.redirect('/friends');
        })
}