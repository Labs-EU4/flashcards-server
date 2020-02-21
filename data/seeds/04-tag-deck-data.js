exports.seed = function(knex) {
  return knex('deck_tags')
    .del()
    .then(function() {
      return knex('deck_tags').insert([
        { deck_id: 1, tag_id: 1 },
        { deck_id: 1, tag_id: 2 },
        { deck_id: 2, tag_id: 3 },
        { deck_id: 2, tag_id: 4 },
        { deck_id: 2, tag_id: 5 },
        { deck_id: 3, tag_id: 6 },
        { deck_id: 3, tag_id: 7 },
        { deck_id: 4, tag_id: 8 },
        { deck_id: 4, tag_id: 9 },
        { deck_id: 5, tag_id: 10 },
        { deck_id: 5, tag_id: 11 },
        { deck_id: 6, tag_id: 12 },
        { deck_id: 6, tag_id: 13 },
        { deck_id: 7, tag_id: 14 },
        { deck_id: 7, tag_id: 15 },
      ]);
    });
};
