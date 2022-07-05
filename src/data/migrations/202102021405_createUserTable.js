const {
  tables,
} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.user, (table) => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      // table.unique('name','idx_user_name_unique')
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.user);

  },
};