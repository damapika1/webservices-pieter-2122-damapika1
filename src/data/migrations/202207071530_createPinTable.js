const {
  tables,
} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.pin, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.foreign('user_id', 'fk_pin_user').references(`${tables.user}.id`)
        .onDelete('CASCADE');
      table.string('title', 50).notNullable();
      table.boolean('fav').notNullable().defaultTo(false);
      table.dateTime('date').notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.pin);
  },
};