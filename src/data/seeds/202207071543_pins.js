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
      description:'Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      fav:true,
      date: '2021-05-25 19:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff81',
      title: 'This is my second note',
      description:'Laoreet sit amet cursus sit amet dictum sit amet. amet, consectetur adipiscing elit. Vulput quis imperdiet massa tincidunt.',
      fav:false,
      date: '2021-05-26 20:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
      title: 'This is my third note',
      description:'Lorem dolore magna dolore magna aliqua. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff82',
      title: 'Pin 4',
      description:'Laoreet sit amet cubore et dolore magna aliqua. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      title: 'Pin 5',
      description:'Laoreet sit amet cursus sit agna aliqua. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      title: 'Pin 6',
      description:'Laoreet sit amet cursusiqua. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      fav:false,
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
      user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      title: 'Pin 7',
      description:'Laoreet sit amet cursus sit amet dictum signa aliqua. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      fav:true,
      date: '2021-05-27 21:40:00',
    },
    ]);
  },
};