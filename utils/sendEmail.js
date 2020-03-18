const nodemailer = require('nodemailer');
const { stubTransport } = require('nodemailer-stub');
const { senderEmail, password } = require('../config/index');

/** A sendEmail util accepting `subject` as subject of the email to be sent
 * `recipient` as email Address of recipent, `emailBody` as the html to be
 * sent to the recipent and an optional callback function that returns the
 * information obtained from nodemailer on success. `quickDecksEmail` as the
 * bcc (blind-copy), used only for user feedback endpoint (sends feedback
 * to user and Quckdecks Team). If no need for this copy,
 * pass last param as `null`.
 */

module.exports = (subject, recipients, emailBody, quickDecksEmail, next) => {
  /**
   * Details of  email to be sent. This is common for both the transport stub
   * used for testing and the actual transporter to be used in production.
   */
  const mailOptions = {
    from: `"Decksify" <${senderEmail}>`,
    to: recipients,
    subject,
    bcc: quickDecksEmail,
    html: emailBody,
  };

  /** If environment is not the testing environment, then create a nodemailer
   * transporter, as opposed to the transport stub.
   */
  if (process.env.DB_ENV !== 'testing') {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: password,
      },
    });

    /**
     * Send Email using the options created earlier. If no errors and the
     * `next` callbackis not null, then invoke the callback.
     */
    transporter.sendMail(mailOptions, (error, info) => {
      if (!error && next) {
        next(info);
      }
    });
  } else {
    /**
     * Node environment is the testing environment and so
     * a stub is created and the same mailOptions are used to
     * mock the sending of an actual email.
     */
    const transporter = nodemailer.createTransport(stubTransport);
    transporter.sendMail(mailOptions);
  }
};
