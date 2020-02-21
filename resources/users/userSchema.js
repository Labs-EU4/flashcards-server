const joi = require('@hapi/joi');

const deleteAccountSchema = joi.object({
  password: joi
    .string()
    .label('Password')
    .required(),
});

const updateUserProfileSchema = joi.object({
  fullName: joi
    .string()
    .label('Full Name')
    .required(),
});

module.exports = {
  updateUserProfileSchema,
  deleteAccountSchema,
};
