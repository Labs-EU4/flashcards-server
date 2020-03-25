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

exports.userOwnsCard = async (req, res, next) => {
  const { subject } = req.decodedToken;
  const { id } = req.params;

  try {
    const card = await getCardById(id);
    if (card.user_id === subject) {
      next();
    } else {
      res.status(401).json({
        message: `You do not own this card to make changes to it`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `You do not own this card to make changes to it`,
    });
  }
};
