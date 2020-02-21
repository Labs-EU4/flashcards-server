const db = require('../../data/dbConfig');

exports.createSession = sessionData => {
  return db('sessions')
    .insert(sessionData, 'id')
    .then(ids => {
      const [id] = ids;
      return this.findSessionById(id);
    });
};

exports.findSessionById = id => {
  return db('sessions as s')
    .leftJoin('sessions_tracker as st', 'st.session_id', 's.id')
    .leftJoin('flashcards as f', 'f.deck_id', 's.deck_id')
    .leftJoin('decks as d', 'd.id', 's.deck_id')
    .select(
      's.id',
      's.deck_id',
      's.user_id',
      's.isCompleted',
      's.last_used',
      'd.name',
      db.raw('array_to_json(ARRAY_AGG( DISTINCT st)) as reviewed_cards'),
      db.raw('array_to_json(ARRAY_AGG( DISTINCT f)) as flashcards')
    )
    .groupBy(
      's.id',
      's.deck_id',
      's.user_id',
      's.isCompleted',
      's.last_used',
      'd.name'
    )
    .where({ 's.id': id })
    .first();
};

exports.findSessionByUserDeckId = (userId, deckId) => {
  return db('sessions as s')
    .leftJoin('sessions_tracker as st', 'st.session_id', 's.id')
    .leftJoin('flashcards as f', 'f.deck_id', 's.deck_id')
    .select(
      's.id',
      's.deck_id',
      's.user_id',
      's.isCompleted',
      's.last_used',
      db.raw('array_to_json(ARRAY_AGG( DISTINCT st)) as reviewed_cards'),
      db.raw('array_to_json(ARRAY_AGG( DISTINCT f)) as flashcards')
    )
    .groupBy('s.id', 's.deck_id', 's.user_id', 's.isCompleted', 's.last_used')
    .where({ 's.user_id': userId, 's.deck_id': deckId, 's.isCompleted': false })
    .first();
};

exports.deleteSession = id => {
  return db('sessions')
    .where({ id })
    .del();
};

exports.getAllSessionsByUser = userId => {
  return db('sessions as s')
    .leftJoin('sessions_tracker as st', 'st.session_id', 's.id')
    .leftJoin('flashcards as f', 'f.deck_id', 's.deck_id')
    .leftJoin('decks as d', 'd.id', 's.deck_id')
    .select(
      's.id',
      'd.name',
      's.deck_id',
      's.user_id',
      's.isCompleted',
      's.last_used',
      db.raw('array_to_json(ARRAY_AGG( DISTINCT st)) as reviewed_cards'),
      db.raw('array_to_json(ARRAY_AGG( DISTINCT f)) as flashcards')
    )
    .groupBy(
      's.id',
      'd.name',
      's.deck_id',
      's.user_id',
      's.isCompleted',
      's.last_used'
    )
    .where({ 's.user_id': userId })
    .orderBy('s.last_used', 'asc')
    .limit(3);
};

exports.markCardReviewed = data => {
  return db('sessions_tracker')
    .insert(data, 'id')
    .then(ids => {
      const [id] = ids;
      return this.findReviewById(id);
    });
};

exports.lastUsedSession = id => {
  return db('sessions')
    .where({ id })
    .update({ last_used: db.raw('NOW()::timestamp') });
};

exports.findReviewById = id => {
  return db('sessions_tracker')
    .where({ id })
    .first();
};

exports.findByReview = param => {
  return db('sessions_tracker')
    .where(param)
    .first();
};
