const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
    await resend.emails.send({
        from: 'Reservations <no-reply@yourapp.com>',
        to,
        subject,
        html
    });
};
