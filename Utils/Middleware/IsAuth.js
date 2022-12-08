const IsAuth = (req, res, next) => {
    if (req.session.User) return next();

    return res.redirect('/');
}

module.exports = IsAuth;