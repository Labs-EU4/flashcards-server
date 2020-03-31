const joi = require('@hapi/joi');

const deckSchema = joi.object({
  name: joi
    .string()
    .label('name')
    .required(),
  tags: joi.array().items(joi.number().integer()),
  isPublic: joi.boolean(),
});

const editDeckSchema = joi.object({
  name: joi.string().label('name'),
  removeTags: joi.array().items(joi.number().integer()),
  addTags: joi.array().items(joi.number().integer()),
  isPublic: joi.boolean(),
});

module.exports = {
  deckSchema,
  editDeckSchema,
};
