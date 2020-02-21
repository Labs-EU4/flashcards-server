exports.up = function(knex) {
  return knex.schema.createTable('ranking', table => {
    table.increments();
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.integer('score');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ranking');
};
