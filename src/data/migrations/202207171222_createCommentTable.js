const {
  tables,
} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.comment, (table) => {
      table.uuid('id').primary();
      table.string('comment',500).notNullable();
      table.dateTime('date').notNullable();

      table.uuid('pin_id').notNullable();
      table.foreign('pin_id', 'fk_comment_pin').references(`${tables.pin}.id`)
        .onDelete('CASCADE');
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.comment);
  },
};