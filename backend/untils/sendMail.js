const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail(name, email, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"BookMyTime Kapcsolat" <${process.env.EMAIL_USER}>`,
            to: "bookmytime884@gmail.com",
            subject: `Új üzenet a BookMyTime-ról - ${name}`,
            html: `
                <h2>Új üzenet érkezett</h2>
                <p><strong>Feladó:</strong> ${name} (${email})</p>
                <p><strong>Üzenet:</strong></p>
                <p>${message}</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Üzenet elküldve: " + info.messageId);
        return true;
    } catch (error) {
        console.error("Hiba az e-mail küldés során:", error);
        return false;
    }
}


module.exports = sendMail;
