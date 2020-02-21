const MailGen = require('mailgen');
const { frontEndSite } = require('../../config');

module.exports = (userEmail, token) => {
  const mailGenerator = new MailGen({
    theme: 'salted',
    product: {
      name: 'QuickDecks',
      link: frontEndSite,
      // logo: ToDo(Add logo URL)
    },
  });

  const email = {
    body: {
      name: userEmail,
      intro: 'Forgot your password?',
      action: {
        instructions: 'No problem! Just click the link to reset your password.',
        button: {
          color: '#D21F3C',
          text: 'Reset password',
          link: `${frontEndSite}/reset/${token}`,
        },
      },
    },
  };

  return mailGenerator.generate(email);
};
// require('fs').writeFileSync('preview.html', emailTemplate, 'utf8');
