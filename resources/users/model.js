const db = require('../../data/dbConfig');

exports.remove = id => {
  return db('users')
    .where({ id })
    .del();
};

exports.updateProfile = async (id, fullName) => {
  return db('users')
    .where({ id })
    .update({ full_name: fullName });
};
