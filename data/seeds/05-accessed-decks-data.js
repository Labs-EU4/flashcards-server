exports.seed = function(knex) {
  return knex('recent_accesses')
    .del()
    .then(function() {
      return knex('recent_accesses').insert([
        { user_id: 1, deck_id: 1 },
        { user_id: 2, deck_id: 2 },
        { user_id: 3, deck_id: 3 },
        { user_id: 4, deck_id: 4 },
        { user_id: 5, deck_id: 5 },
        { user_id: 6, deck_id: 6 },
        { user_id: 7, deck_id: 7 },
      ]);
    });
};
