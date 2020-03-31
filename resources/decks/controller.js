// Deck controller
const Decks = require('./model');

exports.getAllDecks = async (req, res) => {
  try {
    const publicDecks = await Decks.getAll();
    const decks = publicDecks;
    await res.status(200).json({ data: decks });
  } catch (error) {
    res.status(500).json({ message: `Error getting deck: ${error.message}` });
  }
};

exports.getUsersDecks = async (req, res) => {
  const { subject } = req.decodedToken;
  try {
    const decks = await Decks.getUserDecks(subject);
    res.status(200).json({ data: decks });
  } catch (error) {
    res.status(500).json({ message: `Error getting deck: ${error.message}` });
  }
};

exports.getDeck = async (req, res) => {
  const { id } = req.params;
  try {
    const deck = await Decks.findById(id);
    res.status(200).json({ deck });
  } catch (error) {
    res.status(500).json({ message: `Error getting deck: ${error.message}` });
  }
};

exports.addDeck = async (req, res) => {
  const { name, tags, isPublic } = req.body;
  const { subject } = req.decodedToken;
  const newDeck = {
    name,
    user_id: subject,
    public: isPublic,
  };
  try {
    const deck = await Decks.add(newDeck);
    if (tags) {
      await Promise.all(
        tags.map(async tag => {
          try {
            const newDeckTag = { deck_id: deck.id, tag_id: tag };
            Decks.addDeckTag(newDeckTag);
          } catch (error) {
            res.status(500).json({ message: `Error adding tag: ${tag}` });
          }
        })
      );
    }
    const accessCxnData = { user_id: subject, deck_id: deck.id };
    await Decks.createAccessConnection(accessCxnData);
    const newDeckRes = await Decks.findById(deck.id);
    res.status(201).json({ deck: newDeckRes });
  } catch (error) {
    res.status(500).json({ message: `Error adding deck: ${error}` });
  }
};

exports.deleteDeck = async (req, res) => {
  const { id } = req.params;
  try {
    await Decks.remove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      message: `Error deleting deck: ${error.message}`,
    });
  }
};

exports.updateDeck = async (req, res) => {
  const { subject } = req.decodedToken;
  const { id } = req.params;
  const { removeTags, addTags, name, isPublic } = req.body;
  try {
    if (addTags || removeTags) {
      if (addTags) {
        await Promise.all(
          addTags.map(tag => {
            const newDeckTag = { deck_id: id, tag_id: tag };
            return Decks.addDeckTag(newDeckTag);
          })
        );
      }
      if (removeTags) {
        await Promise.all(
          removeTags.map(tag => {
            const deckTag = { deck_id: id, tag_id: tag };
            return Decks.removeDeckTag(deckTag);
          })
        );
      }
    }
    if (name) {
      await Decks.update({ name, public: isPublic }, id);
    }
    const accessCxnData = { user_id: subject, deck_id: id };
    await Decks.findAccessConnection(accessCxnData);
    const deck = await Decks.findById(Number(id));
    res.status(200).json(deck);
  } catch (error) {
    res.status(500).json({
      message: `Error updating deck: ${error.message}`,
    });
  }
};

exports.accessDeck = async (req, res) => {
  const { id } = req.params;
  const { subject } = req.decodedToken;
  const accessCxnData = { user_id: subject, deck_id: id };
  try {
    const foundCxn = await Decks.findAccessConnection(accessCxnData);
    if (foundCxn) {
      await Decks.deckAccessed(accessCxnData);
      res.status(200).end();
    } else {
      await Decks.createAccessConnection(accessCxnData);
      res.status(201).end();
    }
  } catch (error) {
    res.status(500).json({
      message: `Error updating deck access connection: ${error.message}`,
    });
  }
};

exports.recentlyAccessed = async (req, res) => {
  const { subject } = req.decodedToken;
  try {
    const decks = await Decks.getUserLastAccessed(subject);
    const modifiedDecks = decks.map(deck => {
      const flashcardCount =
        deck.flashcards[0] === null ? 0 : deck.flashcards.length;
      return { ...deck, cards_left: flashcardCount };
    });
    res.status(200).json({ data: modifiedDecks });
  } catch (error) {
    res.status(500).json({
      message: `Error getting accessed deck: ${error.message}`,
    });
  }
};

exports.removeAccessed = async (req, res) => {
  const { id } = req.params;
  const { subject } = req.decodedToken;
  const accessCxnData = { user_id: subject, deck_id: id };
  try {
    await Decks.removeAccessConnection(accessCxnData);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      message: `Error removing access connection: ${error.message}`,
    });
  }
};

exports.getFavoriteTags = async (req, res) => {
  const { subject } = req.decodedToken;
  try {
    const tags = await Decks.favoriteDeckTag(subject);
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching tags: ${error.message}`,
    });
  }
};

exports.setDeckMastery = async (req, res) => {
  const user_id = req.decodedToken.subject;
  const { deck_id, rating_score } = req.body;
  try {
    await Decks.setUserDeckScore(deck_id, user_id, rating_score);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({
      message: `Error setting deck mastery: ${error.message}`,
    });
  }
};

exports.getDeckMastery = async (req, res) => {
  const user_id = req.decodedToken.subject;
  const { deck_id } = req.body;
  try {
    const score = await Decks.getUserDeckScore(deck_id, user_id);
    res.status(200).json({ mastery: score });
  } catch (error) {
    res.status(500).json({
      message: `Error getting deck mastery: ${error.message}`,
    });
  }
};

exports.updateDeckMastery = async (req, res) => {
  const user_id = req.decodedToken.subject;
  const { deck_id, rating_score } = req.body;
  try {
    const newScore = await Decks.updateUserDeckScore(
      deck_id,
      user_id,
      rating_score
    );
    res.status(201).json({ mastery: newScore });
  } catch (error) {
    res.status(500).json({
      message: `Error getting deck mastery: ${error.message}`,
    });
  }
};
