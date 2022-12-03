const nodeMailer = require('nodeMailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'dauryjoserosariocaba@gmail.com',
        pass: 'svtcpzueydhnteyw'
    },
    tls: {
        rejectUnauthorized: false
    }
})


module.exports = transporter;