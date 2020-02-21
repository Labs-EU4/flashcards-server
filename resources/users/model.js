const db = require('../../data/dbConfig');

exports.remove = id => {
  return db('users')
    .where({ id })
    .del();
};

exports.checkUserHasScore = userId => {
  return db('rankings')
    .where({ user_id: userId })
    .first();
};

exports.rankUser = ({ userId, score }) => {
  return db('rankings').insert({ user_id: userId, score }, 'score');
};

exports.updateRank = ({ userId, newScore }) => {
  return db('rankings')
    .where({ user_id: userId })
    .update({ score: newScore });
};

exports.getUserRanking = async userId => {
  const user = await db('users')
    .select('email', 'full_name', 'id')
    .where({ id: userId })
    .first();

  const userScore = await db('rankings')
    .select('score')
    .where({ user_id: userId })
    .first();

  return [user, userScore];
};

exports.increaseRank = async ({ userId, rating }) => {
  const userHasScore = await this.checkUserHasScore(userId);
  if (userHasScore) {
    const newScore = Number(userHasScore.score) + Number(rating);

    await this.updateRank({ userId, newScore });
  } else {
    await this.rankUser({
      userId,
      score: rating,
    });
  }
};

exports.topRated = async () => {
  return db('rankings as r')
    .leftJoin('users as u', 'u.id', 'r.user_id')
    .select('r.user_id', 'u.full_name', 'u.email', 'r.score')
    .orderBy('r.score', 'desc')
    .limit(15);
};

exports.updateProfile = async (id, fullName) => {
  return db('users')
    .where({ id })
    .update({ full_name: fullName });
};
