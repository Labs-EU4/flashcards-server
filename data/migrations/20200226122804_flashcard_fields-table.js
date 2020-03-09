exports.up = function(knex) {
  return knex.schema.createTable('flashcard_fields', table => {
    table.increments();
    table.string('field_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('flashcard_fields');
};
