const {
  tables,
} = require('..');
module.exports = {
  seed: async (knex) => {
    await knex(tables.pin).delete();
    await knex(tables.pin).insert([{
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      title: 'This is my first note',
      type:true,
      fav:true,
      date: '2021-05-25 19:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
      title: 'This is my second note',
      type:true,
      fav:false,
      date: '2021-05-26 20:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
      title: 'This is my third note',
      type:true,
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
      title: 'Empty Pin',
      type:true,
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      title: 'Pin 1',
      type:true,
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      title: 'Pin 2',
      type:true,
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      title: 'Pin 3',
      type:true,
      fav:true,
      date: '2021-05-27 21:40:00',
    },
    ]);
  },
};