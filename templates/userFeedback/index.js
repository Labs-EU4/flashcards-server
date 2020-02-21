const MailGen = require('mailgen');
const { frontEndSite } = require('../../config');

module.exports = (userEmail, feedback) => {
  const mailGenerator = new MailGen({
    theme: 'salted',
    product: {
      name: 'QuickDecks',
      link: frontEndSite,
    },
  });

  const email = {
    body: {
      name: userEmail,
      intro:
        // eslint-disable-next-line max-len
        'Thank you for taking the time to provide us some feedback! Here is a copy of your feedback to us:',
      outro: `${feedback}`,
    },
  };

  return mailGenerator.generate(email);
};
