exports.up = function(knex) {
  return knex.schema.table('ratings', table => {
    table.dropColumns('deck_id');
    table
      .integer('session_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('sessions')
      .onDelete('CASCADE');

    table.primary(['session_id', 'card_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.table('ratings', table => {
    table.dropColumn('session_id');
  });
};
