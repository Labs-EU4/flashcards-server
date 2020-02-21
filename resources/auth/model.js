const db = require('../../data/dbConfig');

exports.createUser = user => {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return this.filter({ id });
    });
};

// Filter function can be used to obtain a record by any column name
// As long as the filter param is an object in the form:
// {<column_name> : <column_value>}

exports.filter = filter => {
  return db('users')
    .select('id', 'full_name', 'email', 'image_url', 'isConfirmed', 'createdon')
    .where(filter)
    .first();
};

// The findBy function is used when comparing passwords from the user on login
// And password stored in the db

exports.findBy = param => {
  return db('users')
    .select('id', 'full_name', 'email', 'password', 'isConfirmed', 'createdon')
    .where(param)
    .first();
};

// takes email, returns token (send token).
exports.insertResetToken = (userId, token) => {
  return db('reset_password')
    .insert(userId, token)
    .returning('*');
};

exports.revokeResetToken = token => {
  return db('reset_password')
    .where(token, token)
    .del();
};

exports.filterForToken = token => {
  return db('reset_password')
    .select('user_id', 'token', 'active')
    .where(token)
    .groupBy('active', 'token', 'user_id')
    .havingNotNull('active')
    .first();
};

exports.changePassword = (userId, password) => {
  return db('users')
    .where({ id: userId })
    .update('password', password);
};

exports.confirmEmail = id => {
  return db('users')
    .where({ id })
    .update({ isConfirmed: true }, 'id')
    .then(ids => {
      const userId = ids[0];
      return this.filter({ id: userId });
    });
};

exports.updateImageUrl = async (id, imgUrl) => {
  return db('users')
    .where({ id })
    .update('image_url', imgUrl);
};
