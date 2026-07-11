const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

function sendResetPasswordEmail(to, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Vous avez demandé à réinitialiser votre mot de passe.
      Cliquez sur le lien pour le faire :
      ${resetLink}

      Si vous n’avez pas demandé cette action, ignorez cet email.
      Ce lien est valide pour 1 heure.`,
    html: `
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
      <p>Si vous n’avez pas demandé cette action, ignorez cet email.</p>
      <p>Ce lien est valide pour 1 heure.</p>
    `
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', info.messageId);
        resolve(info);
      }
    });
  });
}

module.exports = {
  sendResetPasswordEmail
};