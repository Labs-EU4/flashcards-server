exports.up = function(knex) {
  return knex.schema.table('flashcards', table => {
    table.renameColumn('image_url', 'image_url_question');
  });
};

exports.down = function(knex) {
  return knex.schema.table('flashcards', table => {
    table.renameColumn('image_url_question', 'image_url');
  });
};
