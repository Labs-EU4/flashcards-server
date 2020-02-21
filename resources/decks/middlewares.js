const { findById, findTagById, findDeckTag } = require('../decks/model');

exports.deckExists = async (req, res, next) => {
  const { id } = req.params;
  const deck = await findById(id);

  if (deck) {
    next();
  } else {
    res.status(404).json({
      message: 'Deck ID does not exist',
    });
  }
};

exports.tagsExists = async (req, res, next) => {
  const { removeTags, addTags } = req.body;
  let error;
  if (removeTags) {
    const results = await Promise.all(
      removeTags.map(async tag => {
        const tagObject = await findTagById(tag);
        if (tagObject) {
          if (Object.getOwnPropertyNames(tagObject).length < 2) {
            return 1;
          }
          return undefined;
        }
        return 1;
      })
    );
    error = results.find(result => result === 1);
  }
  if (addTags) {
    const results = await Promise.all(
      addTags.map(async tag => {
        const tagObject = await findTagById(tag);
        if (tagObject) {
          if (Object.getOwnPropertyNames(tagObject).length < 2) {
            return 1;
          }
          return undefined;
        }
        return 1;
      })
    );
    error = results.find(result => result === 1);
  }
  if (error === undefined) {
    return next();
  }
  return res.status(400).json({
    message: `One of your tags does not exists`,
  });
};

exports.preventDuplicateTags = async (req, res, next) => {
  const { addTags } = req.body;
  const { id } = req.params;
  let hasTags;
  try {
    if (addTags) {
      const results = await Promise.all(
        addTags.map(async tag => {
          const isExist = await findDeckTag(tag, id);
          if (isExist === undefined) {
            return undefined;
          }
          return 1;
        })
      );
      hasTags = results.find(result => result === 1);
    }
    if (hasTags === undefined) {
      return next();
    }
    return res.status(400).json({
      message: `One of your tags already exists`,
    });
  } catch (error) {
    return res.status(400).json({
      message: `One of your tags are not valid`,
    });
  }
};

exports.userOwnsDeck = async (req, res, next) => {
  const { subject } = req.decodedToken;
  const { id } = req.params;

  try {
    const deck = await findById(id);
    if (deck.user_id === subject) {
      next();
    } else {
      res.status(401).json({
        message: `You do not own this deck to make changes to it`,
      });
    }
  } catch (error) {
    res.status(401).json({
      message: `You do not own this deck to make changes to it`,
    });
  }
};
