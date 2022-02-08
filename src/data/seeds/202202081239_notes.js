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

    await knex(tables.note).delete();
    await knex(tables.note).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        title: 'This is my first note',
        text: 'This is some random text 1',
        date: '2021-05-25 19:40:00'
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
        title: 'This is my second note',
        text: 'This is some random text 2',
        date: '2021-05-26 20:40:00'
      },
      {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
        title: 'This is my third note',
        text: 'This is some random text 3',
        date: '2021-05-27 21:40:00'
      }
    ])
  }
}
