const Comment = require("../Models/Comment");
const Publication = require("../Models/Publication");
const Reply = require("../Models/Reply");
const User = require("../Models/User");
const Request = require("../Models/Request");



exports.GetHomePage = (req, res) => {
    const user = req.session.User;
    Publication.findAll({ where: { userId: user.id }, include: [{ model: User }], order: [['createdAt', 'DESC']] })
        .then((results) => {
            const publications = results.map(el => el.dataValues);
            // console.log(publications);
            Comment.findAll({ include: [{ model: User }], order: [['createdAt', 'DESC']] })
                .then(results => {
                    const comments = results.map(el => el.dataValues)
                    // console.log('comments', comments);

                    Reply.findAll({ include: [{ model: User }], order: [['createdAt', 'ASC']] })
                        .then(results => {
                            const replies = results.map(el => el.dataValues);

                            const { id } = user;
                            Request.findAll({ where: { toId: id } })
                                .then(requests => {
                                    requests = requests.map(el => el.dataValues);
                                    // console.log('notifications info', requests);
                                    //Filter the comments and replies to be undes the right post and comments
                                    res.render('Home/Main',
                                        {
                                            home: true,
                                            publications,
                                            comments,
                                            replies,
                                            user,
                                            notifications: requests.length || 0,
                                            homePage: true,
                                        })
                                })


                        })
                })

        })
        .catch((err) => {
            console.log('[ERROR] GETTING HOME PAGE', err);
            res.redirect('/');
        })
}

exports.PostForPost = (req, res) => {
    const { text } = req.body;
    console.log('userid', req.session);
    const userId = req.session.User.id;

    let path = req.file?.path ? req.file.path.split('\\') : null;
    if (path) path = `${path[1]}/${path[2]}`;
    // console.log('path', path);
    // res.redirect('/Home')

    if (path || text) {
        Publication.create({
            image: path,
            text,
            userId
        })
            .then(result => {
                res.redirect('/Home')
            })
    } else {
        req.flash('PublishErrors', 'Cannot make an empty Publication');
        return res.redirect('/home');
    }
}


exports.PostComment = (req, res) => {
    const { publication } = req.params;
    const page = req.query.page;
    const userId = req.session.User.id;
    const { comment } = req.body;

    if (!comment) return res.redirect('/');

    Comment.create({
        text: comment,
        userId,
        publicationId: Number(publication)
    })
        .then(result => {
            // console.log('RESULT', result);
            // console.log('PAGE', page);
            if (page) return res.redirect('/friends');
            res.redirect('/');
        })
        .catch(err => {
            console.log('[ERROR] CREATING COMMENT', err);
            res.redirect('/');
        })
}

exports.PostReply = (req, res) => {
    const { comment } = req.params;
    const userId = req.session.User.id;
    const page = req.query.page;
    const { reply } = req.body;

    if (!reply) return res.redirect('/');

    Reply.create({
        text: reply,
        userId,
        commentId: Number(comment)
    })
        .then(result => {
            // console.log('RESULT', result);
            if (page) return res.redirect('/friends');
            res.redirect('/');
        })
        .catch(err => {
            console.log('[ERROR] CREATING REPLY', err);
            res.redirect('/');
        })
}

exports.DeletePost = (req, res) => {
    const { id } = req.params;
    const userId = req.session.User.id;

    Publication.findOne({ where: { id: id } })
        .then(publication => {
            publication = publication.dataValues;
            if (userId !== publication.userId) return res.redirect('/');

            Publication.destroy({ where: { id: id } })
                .then(result => {
                    res.redirect('/');
                })
                .catch(err => {
                    console.log('[ERROR] DELETING POST', err);
                    res.redirect('/');
                })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/Home');
        })


}

exports.GetEditPost = (req, res) => {
    const { id } = req.params;
    const userId = req.session.User.id;

    Publication.findOne({ where: { id: id }, include: [{ model: User }] })
        .then(publication => {
            publication = publication.dataValues;
            if (userId !== publication.userId) return res.redirect('/');

            res.render('Home/Edit', { publication, edit: true, })
        })
        .catch(err => {
            console.log(err);
            res.redirect('/Home');
        })
}

exports.PostEditPost = (req, res) => {
    const { id, userId, text } = req.body;


    Publication.findOne({ where: { id: id }, include: [{ model: User }] })
        .then(publication => {
            publication = publication.dataValues;
            if (userId !== publication.userId) return res.redirect('/');

            if (req.file) {
                let path = req.file?.path ? req.file.path.split('\\') : null;
                if (path) path = `${path[1]}/${path[2]}`;
                // console.log('path', path);
                Publication.update(
                    {
                        text,
                        image: path
                    },
                    {
                        where: { id: id }
                    })
                    .then(result => {
                        res.redirect('/Home')
                    })
            } else {

                Publication.update(
                    {
                        text
                    },
                    {
                        where: { id: id }
                    })
                    .then(result => {
                        res.redirect('/Home')
                    }).catch(err => {
                        console.log(err);
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect('/Home');
        })

    // if (req.file) {
    //     let path = req.file?.path ? req.file.path.split('\\') : null;
    //     if (path) path = `${path[1]}/${path[2]}`;
    //     // console.log('path', path);
    //     Publication.update(
    //         {
    //             text,
    //             image: path
    //         },
    //         {
    //             where: { id: id }
    //         })
    //         .then(result => {
    //             res.redirect('/Home')
    //         })
    // } else {
    //     Publication.findOne({ where: { id: id } })
    //         .then(user => {
    //             user = user.dataValues;
    //             Publication.update(
    //                 {
    //                     text
    //                 },
    //                 {
    //                     where: { id: id }
    //                 })
    //                 .then(result => {
    //                     res.redirect('/Home')
    //                 })
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    // }
}