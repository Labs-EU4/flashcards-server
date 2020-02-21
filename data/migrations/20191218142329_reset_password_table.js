exports.up = function(knex) {
  return knex.schema.createTable('reset_password', table => {
    table.increments();
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .string('token')
      .notNullable()
      .unique();
    table.boolean('active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reset_password');
};
