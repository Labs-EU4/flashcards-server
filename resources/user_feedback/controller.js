const userFeedbackTemplate = require('../../templates/userFeedback');
const sendEmail = require('../../utils/sendEmail');
const { senderEmail } = require('../../config/index');
const model = require('./model');

// userFeedback recieves a body of text from the user.
// It gets the email from the logged-in user and an email with feedback
// is sent to their email address.
// This is also sent to QuickDecs email, as a blind-copy.

exports.userFeedback = async (req, res) => {
  try {
    const { feedback } = req.body;
    const id = req.decodedToken.subject;
    const userEmailObj = await model.getUserEmail(id);
    const userEmail = userEmailObj.email;

    sendEmail(
      'Feedback',
      userEmail,
      userFeedbackTemplate(userEmail, feedback),
      senderEmail
    );

    res.status(201).json({
      message: `User feedback sent successfully`,
      data: {
        feedback,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to send feedback` });
  }
};
