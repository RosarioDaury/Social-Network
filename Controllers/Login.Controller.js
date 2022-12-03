// Models to use
const User = require('../Models/User');

//Functional exports to use
const bcrypt = require('bcrypt');
const transporter = require('../Services/MailSender');
// const { v4: uuidv4 } = require('uuid');
const GeneratePassword = require('../Utils/GeneralHelpers/GeneratePassword');

// Controller for LOGIN Logic and UI // 
// This one is to redirect from main Page //
exports.GetLoginPage = (req, res) => {
    res.redirect('/login');
}
exports.LoginPage = (req, res) => {
    res.render('Login/Login');
}
exports.PostLoginPage = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ where: { username: username } })
        .then(user => {
            // console.log(user);
            if (!user) {
                req.flash('LoginErrors', 'Username or Password incorrect');
                return res.redirect('/login');
            }
            user = user.dataValues;

            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    console.log('[SUCCESFULLY LOGGED IN]');
                    return res.redirect('/');
                } else {
                    req.flash('LoginErrors', 'Username or Password incorrect');
                    return res.redirect('/login');
                }
            });
        })
        .catch(err => {
            console.log('[LOGIN ERROR]', err);
            res.redirect('/login');
        })
}


// Controller for register Logic and UI //
exports.GetRegisterPage = (req, res) => {
    res.render('Login/Register');
}
exports.PostRegisterPage = (req, res) => {
    const { firstName, lastName, username, password, password1 } = req.body;

    if (password != password1) {
        req.flash('RegisterErrors', 'Passwords do not match');
        return res.redirect('/register');
    }

    //Encrypting Password Before saving
    const passToSave = bcrypt.hashSync(password, 10);
    console.log(passToSave, 'password');

    User.create({
        firstName,
        lastName,
        username,
        password: passToSave
    })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log('[CREATE USER ERROR]', err);
            res.redirect('/register');
        })


}


// Controller for Forget Password Logic and UI // 
exports.GetForgotPasswordPage = (req, res) => {
    res.render('Login/ForgotPass');
}
exports.PostForgotPasswordPage = (req, res) => {
    const { email } = req.body;

    User.findOne({ where: { username: email } })
        .then(user => {
            //If the email do not correspond to any user
            if (!user) {
                req.flash('ForgetPasswordErrors', 'This email is not related with no User');
                return res.redirect('/forgotpassword');
            }

            user = user.dataValues;
            const newPass = GeneratePassword();
            const passwordToSave = bcrypt.hashSync(newPass, 10);
            const { id, firstName, lastName, username } = user;
            console.log(user);

            User.update(
                {
                    firstName,
                    lastName,
                    username,
                    password: passwordToSave
                },
                { where: { id: id } }
            )
                .then(result => {

                    const mailOptions = {
                        from: 'sender@email.com',
                        to: email,
                        subject: `Password Reset`,
                        html: `<p>Hi ${user.firstName}, this is your new Password: ${newPass}</p>`
                    };
                    // transporter.sendMail()
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err)
                            console.log(err)
                        else
                            res.redirect('/login');
                    });
                })
                .catch(err => {
                    console.log('[RESTING PASSWORD ERROR]', err);
                    res.redirect('/forgotpassword');
                })



        })
        .catch(err => {
            console.log('[FORGOT PASSWORD ERROR]', err);
            res.redirect('/forgotpassword');
        })


}



