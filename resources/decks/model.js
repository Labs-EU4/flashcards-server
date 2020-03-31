const db = require('../../data/dbConfig.js');

exports.getAll = () => {
  return db('deck_tags as dt')
    .rightJoin('decks as d', 'd.id', 'dt.deck_id')
    .leftJoin('flashcards as f', 'f.deck_id', 'd.id')
    .leftJoin('tags as t', 't.id', 'dt.tag_id')
    .leftJoin('users as u', 'u.id', 'd.user_id')
    .select(
      'd.id as deck_id',
      'd.user_id',
      'u.full_name as author',
      'd.name as deck_name',
      'd.public',
      'd.created_at',
      'd.updated_at',
      // ARRAY_AGG creates an array, array_remove removes NULL values
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT t), NULL)) as tags'
      ),
      // ARRAY_AGG creates an array, array_remove removes NULL values
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT f), NULL)) as flashcards'
      )
    )
    .groupBy(
      'd.id',
      'd.user_id',
      'u.full_name',
      'd.name',
      'd.public',
      'd.created_at',
      'd.updated_at'
    )
    .where({ 'd.public': true });
};

exports.getUserDecks = userId => {
  return db('deck_tags as dt')
    .rightJoin('decks as d', 'd.id', 'dt.deck_id')
    .leftJoin('flashcards as f', 'f.deck_id', 'd.id')
    .leftJoin('tags as t', 't.id', 'dt.tag_id')
    .leftJoin('users as u', 'u.id', 'd.user_id')
    .select(
      'd.id as deck_id',
      'd.user_id',
      'd.name as deck_name',
      'd.public',
      'd.created_at',
      'd.updated_at',
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT t), NULL)) as tags'
      ),
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT f), NULL)) as flashcards'
      )
    )
    .groupBy(
      'd.id',
      'd.user_id',
      'd.name',
      'd.public',
      'd.created_at',
      'd.updated_at'
    )
    .where({ 'd.user_id': userId });
};

exports.add = async deck => {
  const [newDeck] = await db('decks')
    .insert(deck)
    .returning('*');
  return newDeck;
};

exports.findById = id => {
  return db('deck_tags as dt')
    .rightJoin('decks as d', 'd.id', 'dt.deck_id')
    .leftJoin('flashcards as f', 'f.deck_id', 'd.id')
    .leftJoin('tags as t', 't.id', 'dt.tag_id')
    .select(
      'd.id as deck_id',
      'd.user_id',
      'd.name as deck_name',
      'd.public',
      'd.created_at',
      'd.updated_at',
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT t), NULL)) as tags'
      ),
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT f), NULL)) as flashcards'
      )
    )
    .groupBy(
      'd.id',
      'd.user_id',
      'd.name',
      'd.public',
      'd.created_at',
      'd.updated_at'
    )
    .where({ 'd.id': id })
    .first();
};

exports.remove = id => {
  return db('decks')
    .where({ id })
    .del();
};

exports.update = (data, id) => {
  const updateFields = Object.keys(data);
  return db('decks')
    .where({ id })
    .update(data, updateFields);
};

const getDeckTagById = id => {
  return db('deck_tags')
    .where({ id })
    .first();
};

exports.addDeckTag = newDeckTag => {
  return db('deck_tags')
    .insert(newDeckTag)
    .then(id => {
      getDeckTagById({ id: id[0] });
    });
};

exports.removeDeckTag = deckTag => {
  return db('deck_tags')
    .where(deckTag)
    .del();
};

exports.findTagById = id => {
  return db('tags')
    .where({ id })
    .first();
};

exports.findDeckTag = (tagId, deckId) => {
  return db('deck_tags')
    .where({ deck_id: deckId, tag_id: tagId })
    .first();
};

exports.favoriteDeckTag = userId => {
  return db('deck_tags as dt')
    .rightJoin('decks as d', 'd.id', 'dt.deck_id')
    .leftJoin('tags as t', 't.id', 'dt.tag_id')
    .select('t.name')
    .count('t.name', { as: 'value_occurrence' })
    .groupBy('t.name')
    .orderBy('value_occurrence', 'desc')
    .where({ 'd.user_id': userId });
};

exports.createAccessConnection = data => {
  return db('recent_accesses').insert(data);
};

exports.deckAccessed = data => {
  return (
    db('recent_accesses')
      .where(data)
      // inserts a date with current time stamp
      .update({ accessed_time: db.raw('NOW()::timestamp') })
  );
};

exports.findAccessConnection = data => {
  return db('recent_accesses')
    .where(data)
    .first();
};

exports.removeAccessConnection = data => {
  return db('recent_accesses')
    .where(data)
    .del();
};

exports.getUserLastAccessed = id => {
  return db('recent_accesses as ra')
    .innerJoin('decks as d', 'd.id', 'ra.deck_id')
    .leftJoin('flashcards as f', 'd.id', 'f.deck_id')
    .select(
      'd.id as deck_id',
      'd.user_id',
      'd.name as deck_name',
      'd.public',
      'd.created_at',
      'd.updated_at',
      'ra.accessed_time',
      db.raw(
        'array_to_json(array_remove(ARRAY_AGG( DISTINCT f), NULL)) as flashcards'
      )
    )
    .groupBy(
      'd.id',
      'd.user_id',
      'd.name ',
      'd.public',
      'd.created_at',
      'd.updated_at',
      'ra.accessed_time'
    )
    .where({ 'ra.user_id': id })
    .orderBy('ra.accessed_time', 'desc')
    .limit(3);
};

exports.setUserDeckScore = (deck_id, user_id, rating_score) => {
  return db('deck_ratings').insert({
    deck_id: deck_id,
    user_id: user_id,
    rating_score: rating_score,
  });
};

exports.getUserDeckScore = (deck_id, user_id) => {
  return db('deck_ratings')
    .where({ deck_id, user_id })
    .first();
};

exports.updateUserDeckScore = (deck_id, user_id, rating_score) => {
  return db('deck_ratings')
    .update({ rating_score })
    .where({ user_id, deck_id });
};
