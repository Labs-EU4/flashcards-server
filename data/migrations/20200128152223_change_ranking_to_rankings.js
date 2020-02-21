exports.up = function(knex) {
  return knex.schema.renameTable('ranking', 'rankings');
};

exports.down = function(knex) {
  return knex.schema.renameTable('rankings', 'ranking');
};
