const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendResetPasswordEmail = (email, link) => {
    sgMail.send({
        to: email,
        from: 'perry2006@hotmail.com',
        subject: 'Reset your password!',
        html: resetPasswordTemplate(link)
    })
}


module.exports = {
    sendResetPasswordEmail
}