const sgMail = require('@sendgrid/mail')

const sendgridAPIkey = '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'

sgMail.setApiKey(sendgridAPIkey)

// sgMail.send({
//     to: 'ammar.botonjic@gmail.com',
//     from: 'ammar.botonjic@gmail.com',
//     subject: 'This is my first creation',
//     text: 'I hope this one actually get to you.'
// })

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ammar.botonjic@gmail.com',
        subject: 'Do not go, please',
        text: `Dont go, mr ${name}, tell us why you canceled.`
    })
}

module.exports = {
    sendCancelationEmail
}