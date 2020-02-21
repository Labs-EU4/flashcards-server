const {
  createCard,
  getAllCardsByUser,
  removeCard,
  updateCard,
  flashcardOfTheDay,
  scoreCard,
} = require('./model');

const { markCardReviewed } = require('../sessions/model');

exports.fetchAllCardsByUser = async (req, res) => {
  const { subject } = req.decodedToken;

  try {
    const cards = await getAllCardsByUser(subject);
    res.status(200).json({ cards });
  } catch (error) {
    res.status(500).json({
      message: `Failed to fetch all flashcards, ${error.message}`,
    });
  }
};

exports.fetchCardById = async (req, res) => {
  try {
    res.status(200).json({ card: req.card });
  } catch (error) {
    res.status(500).json({
      message: `Failed to fetch flashcard because 
      ${error.message}`,
    });
  }
};

exports.makeCard = async (req, res) => {
  const { subject } = req.decodedToken;
  const {
    deckId,
    questionText,
    answerText,
    imageUrlQuestion,
    imageUrlAnswer,
  } = req.body;
  const cardInfo = {
    deck_id: deckId,
    user_id: subject,
    question: questionText,
    answer: answerText,
    image_url_question: imageUrlQuestion,
    image_url_answer: imageUrlAnswer,
  };
  try {
    const card = await createCard(cardInfo);
    res.status(201).json({ card });
  } catch (error) {
    res.status(500).json({
      message: `Failed to create flashcard ${error.message}`,
    });
  }
};

exports.editCard = async (req, res) => {
  const {
    deckId,
    questionText,
    answerText,
    imageUrlQuestion,
    imageUrlAnswer,
  } = req.body;
  const { id } = req.params;
  const cardInfo = {
    deck_id: deckId,
    question: questionText,
    answer: answerText,
    image_url_question: imageUrlQuestion,
    image_url_answer: imageUrlAnswer,
  };
  try {
    const card = await updateCard(id, cardInfo);
    res.status(200).json({ card });
  } catch (error) {
    res.status(500).json({
      message: `Failed to update flashcard, ${error.message}`,
    });
  }
};

exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    await removeCard(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      message: `Failed to delete, ${error.message}`,
    });
  }
};

exports.fetchCardOfTheDay = async (req, res) => {
  const { subject } = req.decodedToken;

  try {
    const card = await flashcardOfTheDay(subject);
    res.status(200).json({ card });
  } catch (error) {
    res.status(500).json({
      message: `Failed to fetch a random card: ${error.message}`,
    });
  }
};

exports.rateCard = async (req, res) => {
  const { subject } = req.decodedToken;

  // eslint-disable-next-line camelcase
  const { card_id, session_id, rating } = req.body;

  const scoreObject = {
    user_id: subject,
    card_id,
    session_id,
    rating,
  };

  try {
    await markCardReviewed({ session_id, card_id });
    const result = await scoreCard(scoreObject);
    if (result > 0) {
      res.status(201).json({
        message: `Successfully scored`,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Failed to score card ${error}`,
    });
  }
};
