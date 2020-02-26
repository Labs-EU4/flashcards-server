exports.up = function(knex) {
  return knex.schema.createTable('flashcards', table => {
    table.increments();
    table
      .integer('deck_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('decks')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('question').notNullable();
    table.string('answer').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('flashcards');
};
