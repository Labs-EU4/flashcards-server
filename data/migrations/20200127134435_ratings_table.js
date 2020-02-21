exports.up = function(knex) {
  return knex.schema.createTable('ratings', table => {
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('card_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('flashcards')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('deck_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('decks')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table.integer('rating').notNullable();

    // table.primary(['user_id', 'card_id']);
    // table.increments();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ratings');
};
