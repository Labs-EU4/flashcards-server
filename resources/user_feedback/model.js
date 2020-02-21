const db = require('../../data/dbConfig');

exports.getUserEmail = id => {
  return db('users')
    .select('email')
    .where({ id })
    .first();
};
