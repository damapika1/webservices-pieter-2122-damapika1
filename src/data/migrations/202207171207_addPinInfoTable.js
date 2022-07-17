const {
  tables,
} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.pin, (table) => {
      table.string('description',255).notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.pin, (table) => {
      table.dropColumns('description');
    });
  },
};