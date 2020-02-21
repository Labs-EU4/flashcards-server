const MailGen = require('mailgen');
const { frontEndSite } = require('../../config');

module.exports = (userFullName, token) => {
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
      name: userFullName,
      intro: 'Are you ready to start acing those tests?',
      action: {
        instructions: 'Please click the button below to verify your account',
        button: {
          color: '#D21F3C',
          text: 'Verify account',
          link: `${frontEndSite}/confirm/${token}`,
        },
      },
    },
  };

  return mailGenerator.generate(email);
};
// require('fs').writeFileSync('preview.html', emailTemplate, 'utf8');
