const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODE_MAILER_HOST,
    port: process.env.NODE_MAILER_PORT,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.NODE_MAILER_USERNAME,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: "Manish_Chitre@natours.io",
    to: "chitre.manish@gmail.com",//options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  console.log(mailOptions);

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;