const joi = require('@hapi/joi');

exports.flashCardSchema = joi.object({
  questionText: joi
    .string()
    .label('Question Text')
    .required(),
  answerText: joi
    .string()
    .label('Answer Text')
    .required(),
  deckId: joi
    .number()
    .integer()
    .label('Deck Id')
    .required(),
  imageUrlQuestion: joi
    .string()
    .allow('')
    .label('Image URL Question'),
  imageUrlAnswer: joi
    .string()
    .allow('')
    .label('Image URL Answer'),
});

exports.ratingsSchema = joi.object({
  card_id: joi
    .number()
    .integer()
    .label('Card Id')
    .required(),

  session_id: joi
    .number()
    .integer()
    .label('Session Id')
    .required(),

  rating: joi
    .number()
    .integer()
    .label('Card Score')
    .required(),
});
