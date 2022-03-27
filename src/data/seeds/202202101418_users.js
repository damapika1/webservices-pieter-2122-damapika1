const {
  tables
} = require('..');
module.exports = {
  seed: async (knex) => {
    await knex(tables.user).delete();
    await knex(tables.user).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        name: 'Rayme Emin',
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        name: 'Emin Rayme',
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
        name: 'Rayme Basri Emin',

      }
    ])
  }
}
