const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendResetPasswordEmail = (email, link) => {
    sgMail.send({
        to: email,
        from: 'perry2006@hotmail.com',
        subject: 'Reset your password!',
        text: `To reset your password, click this link: ${link}`
    })
}

module.exports = {
    sendResetPasswordEmail
}