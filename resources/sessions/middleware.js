const {
  findByReview,
  findSessionById,
  findSessionByUserDeckId,
} = require('./model');
const { getCardById } = require('../flashcards/model');
const { findById } = require('../decks/model');

exports.sessionExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sessionExists = await findSessionById(id);
    if (sessionExists) {
      next();
    } else {
      res.status(404).json({ message: `Session does not exists ` });
    }
  } catch (error) {
    res
      .status(404)
      .json({ message: `Session does not exists ${error.message}` });
  }
};

exports.preventDuplicateIncompleteSessions = async (req, res, next) => {
  const { deckId } = req.body;
  const { subject } = req.decodedToken;
  try {
    const sessionExists = await findSessionByUserDeckId(subject, deckId);
    if (!sessionExists) {
      next();
    } else {
      res.status(404).json({
        message: `Cannot create duplicate incomplete sessions `,
        session: sessionExists,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: `Cannot create duplicate incomplete sessions ${error.message}`,
    });
  }
};

exports.deckExists = async (req, res, next) => {
  const { deckId } = req.body;
  try {
    const deckExists = await findById(deckId);
    if (deckExists) {
      next();
    } else {
      res.status(404).json({
        message: `Deck does not exists`,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: `Deck does not exists  ${error.message}`,
    });
  }
};

exports.cardExists = async (req, res, next) => {
  const { cardIds } = req.body;
  try {
    if (cardIds) {
      await Promise.all(
        cardIds.map(async cardId => {
          try {
            await getCardById(cardId);
          } catch (error) {
            res.status(404).json({ message: `Flashcard not found ${cardId}` });
          }
        })
      );
    }
    next();
  } catch (error) {
    res.status(404).json({
      message: `Error checking cards exists ${error.message}`,
    });
  }
};

exports.cardAlreadyMarked = async (req, res, next) => {
  const { cardIds } = req.body;
  const { id } = req.params;
  let markedCards;
  try {
    if (cardIds) {
      const results = await Promise.all(
        cardIds.map(async cardId => {
          const isMarked = await findByReview({
            card_id: cardId,
            session_id: id,
          });
          if (isMarked === undefined) {
            return undefined;
          }
          return 1;
        })
      );
      markedCards = results.find(result => result === 1);
    }
    if (markedCards === undefined) {
      return next();
    }
    return res.status(404).json({
      message: `Card is already marked in session as reviewed`,
    });
  } catch (error) {
    return res.status(404).json({
      message: `Error checking cards have been marked ${error.message}`,
    });
  }
};

exports.cardBelongsToDeck = async (req, res, next) => {
  const { cardIds } = req.body;
  const { id } = req.params;
  let cardNotBelong;
  try {
    if (cardIds) {
      const results = await Promise.all(
        cardIds.map(async cardId => {
          const session = await findSessionById(id);
          const deck = await findById(session.deck_id);
          const card = await getCardById(cardId);
          if (deck.deck_id === card.deck_id) {
            return undefined;
          }
          return 1;
        })
      );
      cardNotBelong = results.find(result => result === 1);
    }
    if (cardNotBelong === undefined) {
      return next();
    }
    return res.status(404).json({
      message: `Card does not belong to this session, does not exists in deck`,
    });
  } catch (error) {
    return res.status(404).json({
      message: `Error checking cards belong to session${error.message}`,
    });
  }
};
