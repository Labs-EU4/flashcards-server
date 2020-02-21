exports.seed = function(knex) {
  return knex('sessions_tracker')
    .del()
    .then(function() {
      return knex('sessions_tracker').insert([
        { session_id: 1, card_id: 1 },
        { session_id: 2, card_id: 3 },
        { session_id: 3, card_id: 5 },
        { session_id: 4, card_id: 7 },
        { session_id: 5, card_id: 9 },
        { session_id: 6, card_id: 11 },
      ]);
    });
};
