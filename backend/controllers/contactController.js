const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // Admin email cím
        pass: process.env.ADMIN_EMAIL_PASSWORD, // Gmail App jelszó
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL, // Admin email cím
      subject: `Kapcsolatfelvétel - ${name}`,
      text: `Feladó: ${name} (${email})\n\nÜzenet:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Üzenet sikeresen elküldve!" });
  } catch (error) {
    console.error("Email küldési hiba:", error);
    res.status(500).json({ error: "Nem sikerült elküldeni az üzenetet!" });
  }
};
