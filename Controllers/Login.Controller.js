// Models to use
const User = require('../Models/User');

//Functional exports to use
const bcrypt = require('bcrypt');
const transporter = require('../Services/MailSender');
const { v4: uuidv4 } = require('uuid');
const GeneratePassword = require('../Utils/GeneralHelpers/GeneratePassword');

// Controller for LOGIN Logic and UI // 
// This one is to redirect from main Page //
exports.GetLoginPage = (req, res) => {
    console.log('locals', res.locals);
    if (res.locals.isAuth) {
        return res.redirect('/Home');
    }
    res.redirect('/login');
}
exports.LoginPage = (req, res) => {
    res.render('Login/Login', { login: true });
}
exports.PostLoginPage = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ where: { username: username } })
        .then(user => {
            // console.log(user);
            if (!user || user.dataValues.status === '0') {
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
                    req.session.isAuth = true;
                    req.session.User = user;
                    return req.session.save((err) => {
                        if (err) console.log('[ERROR] SAVING LOGIN SESSION');
                        res.redirect('/');
                    });
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
    res.render('Login/Register', { login: true });
}
exports.PostRegisterPage = (req, res) => {
    const { firstName, lastName, username, email, phone, password, password1 } = req.body;
    let path = req.file?.path ? req.file.path.split('\\') : null;
    if (path) path = `${path[1]}/${path[2]}`;
    const PhoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (password != password1) {
        req.flash('RegisterErrors', 'Passwords do not match');
        return res.redirect('/register');
    }

    if (!PhoneRegex.test(phone)) {
        req.flash('RegisterErrors', 'Phone Number format Invalid (must to have the following format: xxx-xxx-xxxx)');
        return res.redirect('/register');
    }

    //Encrypting Password Before saving
    const passToSave = bcrypt.hashSync(password, 10);
    const confirmCode = uuidv4();
    // console.log(passToSave, 'password');

    User.create({
        firstName,
        lastName,
        username,
        email,
        phone,
        photo: '/' + path,
        password: passToSave,
        status: false,
        confirmCode
    })
        .then(result => {
            console.log('result', result);

            const mailOptions = {
                from: 'sender@email.com',
                to: email,
                subject: `Password Reset`,
                html: `<p>Hi ${result.dataValues.firstName}, Activate you account from here <a href='http://localhost:3000/confirmAccount/${confirmCode}'>CLICK HERE</a></p>`
            };
            // transporter.sendMail()
            transporter.sendMail(mailOptions, function (err, info) {
                if (err)
                    console.log(err)
                else
                    res.redirect('/login');
            });
            res.redirect('/login');
        })
        .catch(err => {
            console.log('[CREATE USER ERROR]', err);
            res.redirect('/register');
        })


}


// Controller for Forget Password Logic and UI // 
exports.GetForgotPasswordPage = (req, res) => {
    res.render('Login/ForgotPass', { login: true });
}
exports.PostForgotPasswordPage = (req, res) => {
    const { username } = req.body;

    User.findOne({ where: { username: username } })
        .then(user => {
            //If the email do not correspond to any user
            if (!user) {
                req.flash('ForgetPasswordErrors', 'This Username is not related with no User');
                return res.redirect('/forgotpassword');
            }

            user = user.dataValues;
            const newPass = GeneratePassword();
            const passwordToSave = bcrypt.hashSync(newPass, 10);
            const { firstName, lastName, username, email, phone, photo, password } = user;
            console.log(user);

            User.update(
                {
                    firstName,
                    lastName,
                    username,
                    email,
                    phone,
                    photo,
                    password: passwordToSave,
                    friends: '[]'
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



exports.ActivateAccount = (req, res) => {
    const { code } = req.params;

    User.findOne({ where: { confirmCode: code } })
        .then(user => {
            user = user.dataValues
            User.update(
                {
                    ...user,
                    status: true
                },
                {
                    where: { confirmCode: code }
                }
            )
                .then(results => {
                    res.redirect('/');
                })
                .catch(err => {
                    console.log('[ERROR ACTIVATING ACCOUNT]', err);
                    res.redirect('/');
                })
        })
        .catch(err => {
            console.log('[ERROR ACTIVATING ACCOUNT]', err);
            res.redirect('/');
        })
}


exports.LogOut = (req, res) => {
    req.session.User = null;
    req.session.isAuth = false;

    req.session.save(err => {
        res.redirect('/');
    })

}



