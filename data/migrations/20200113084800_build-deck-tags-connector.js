exports.up = function(knex) {
  return knex.schema.createTable('deck_tags', table => {
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
      .integer('tag_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('tags')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('deck_tags');
};
