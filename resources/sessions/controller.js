const {
  findSessionById,
  createSession,
  deleteSession,
  getAllSessionsByUser,
  markCardReviewed,
  lastUsedSession,
} = require('./model');

exports.fetchSessionById = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await findSessionById(id);
    const reviewedCount =
      session.reviewed_cards[0] === null ? 0 : session.reviewed_cards.length;
    const flashcardCount =
      session.flashcards[0] === null ? 0 : session.flashcards.length;
    const cardAmountLeft = flashcardCount - reviewedCount;
    res
      .status(200)
      .json({ session: { ...session, cards_left: cardAmountLeft } });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to fetch session ${error.message}` });
  }
};

exports.makeSession = async (req, res) => {
  const { deckId } = req.body;
  const { subject } = req.decodedToken;
  const sessionData = {
    user_id: subject,
    deck_id: deckId,
  };
  try {
    const session = await createSession(sessionData);
    res.status(201).json({ session });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to create session ${error.message}` });
  }
};

exports.removeSession = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteSession(id);
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to delete session ${error.message}` });
  }
};

exports.getUserSessions = async (req, res) => {
  const { subject } = req.decodedToken;
  try {
    const sessions = await getAllSessionsByUser(subject);
    const modifiedSessions = sessions.map(session => {
      const reviewedCount =
        session.reviewed_cards[0] === null ? 0 : session.reviewed_cards.length;
      const flashcardCount =
        session.flashcards[0] === null ? 0 : session.flashcards.length;
      const cardAmountLeft = flashcardCount - reviewedCount;
      return { ...session, cards_left: cardAmountLeft };
    });
    res.status(200).json({ data: modifiedSessions });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to fetch user sessions ${error.message}` });
  }
};

exports.modifySession = async (req, res) => {
  const { isCompleted, cardIds } = req.body;
  const { id } = req.params;
  try {
    if (cardIds) {
      await Promise.all(
        cardIds.map(async cardId => {
          try {
            const reviewedCard = {
              card_id: cardId,
              session_id: Number(id),
            };
            await markCardReviewed(reviewedCard);
          } catch (error) {
            res.status(500).json({
              message: `Error making card reviewed ${cardId}, ${error.message}`,
            });
          }
        })
      );
    }
    if (isCompleted) {
      await deleteSession(id);
      res.status(200).json({
        message: `User successfully completed a session, session is removed`,
      });
    } else {
      await lastUsedSession(id);
      const session = await findSessionById(id);
      res.status(200).json({ session });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Unable to update session ${error.message}` });
  }
};
