const {
  tables,
} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.note, (table) => {
      table.uuid('id').primary();
      table.uuid('pin_id').notNullable();
      table.foreign('pin_id', 'fk_note_pin').references(`${tables.pin}.id`)
        .onDelete('CASCADE');
      table.string('text', 255);
      // table.dateTime('date').notNullable();


      // table.unique('name','idx_user_name_unique')
    });
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.note);
  },
};