const sgMail = require('@sendgrid/mail')

const sendgridAPIkey = process.env.SEND_GRID_API_KEY

sgMail.setApiKey(sendgridAPIkey)


const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '',
        subject: 'Do not go, please',
        text: `Dont go, mr ${name}, tell us why you canceled.`
    })
}

module.exports = {
    sendCancelationEmail
}
