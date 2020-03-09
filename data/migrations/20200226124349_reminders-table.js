exports.up = function(knex) {
  return knex.schema.createTable('reminders', table => {
    table.increments();
    table
      .integer('deck_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('decks')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('rating_score').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reminders');
};
