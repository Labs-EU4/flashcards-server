exports.up = function(knex) {
  return knex.schema.createTable('card_mastery', table => {
    table.increments();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('flashcard_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('flashcards')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('value').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('card_mastery');
};
