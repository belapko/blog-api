const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

exports.sendActivationMail = async (to, link) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Активация аккаунта ' + process.env.CLIENT_URL,
        text: '',
        html:
            `
                <div>
                    <h1>Для активации аккаунта перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
    });
}