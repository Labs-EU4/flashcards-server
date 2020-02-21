const joi = require('@hapi/joi');

const userFeedbackSchema = joi.object({
  feedback: joi
    .string()
    .min(5)
    .max(200)
    .required(),
});

module.exports = {
  userFeedbackSchema,
};
