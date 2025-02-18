const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function getTransporter(userEmail) {
  try {
    const [rows] = await db.execute("SELECT email FROM felhasznalo WHERE email = ?", [userEmail]);

    let smtpUser = process.env.ADMIN_EMAIL;
    let smtpPass = process.env.ADMIN_EMAIL_PASSWORD;

    if (rows.length > 0) {
      smtpUser = userEmail;
      smtpPass = process.env.SMTP_PASS;
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } catch (error) {
    console.error("SMTP beállítási hiba:", error);
    throw new Error("SMTP beállítási hiba");
  }
}

exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Minden mező kitöltése kötelező!" });
  }

  try {
    const transporter = await getTransporter(email);

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_EMAIL,
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
