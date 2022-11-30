exports.GetLoginPage = (req, res) => {
    res.redirect('/login');
}

exports.LoginPage = (req, res) => {
    res.render('Login/Login');
}

exports.GetRegisterPage = (req, res) => {
    res.render('Login/Register');
}