exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.timestamp('createdon').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('createdon');
  });
};
