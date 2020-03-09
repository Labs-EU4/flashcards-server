const { getCardById } = require('./model');

exports.cardExists = async (req, res, next) => {
  const { id } = req.params;

  if (id) {
    const card = await getCardById(id);
    if (card) {
      req.card = card;
      return next();
    }
  }

  return res.status(404).json({
    message: 'Flashcard does not exist',
  });
};
