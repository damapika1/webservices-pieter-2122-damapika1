const {
  tables,
} = require('..');
module.exports = {
  seed: async (knex) => {
    await knex(tables.note).delete();
    await knex(tables.note).insert([{
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      text: 'I love writing cute notes <3',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      text: 'This is some random text 2',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
      text: 'This is my third note',
    },
    ]);
  },
};