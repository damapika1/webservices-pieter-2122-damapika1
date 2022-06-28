const {
  tables
} = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.note, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable();
      table.foreign('user_id', 'fk_note_user').references(`${tables.user}.id`)
        .onDelete('CASCADE');
      table.string('title', 50);
      table.string('text', 255);
      table.dateTime('date').notNullable();


      // table.unique('name','idx_user_name_unique')
    })
  },
  down: (knex) => {
    return knex.schema.dropIfExists(tables.note);
  },
};