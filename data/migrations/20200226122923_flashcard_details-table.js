exports.up = function(knex) {
  return knex.schema.createTable('flashcard_details', table => {
    table.increments();
    table
      .integer('field_type_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('flashcard_fields')
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
    table.string('field_value').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('flashcard_details');
};
