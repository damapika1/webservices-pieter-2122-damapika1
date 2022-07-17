const {
  tables,
} = require('..');
module.exports = {
  seed: async (knex) => {
    await knex(tables.comment).delete();
    await knex(tables.comment).insert([{
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
      comment:'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '2021-05-25 19:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
      comment:'Lorem ipsum dolor Lorem ipsum dolor sit amet.',
      date: '2021-05-26 20:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
      comment:'Lorem ipsum dolor Lorem ipsum dolor sit amet.',
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
      comment:'Lorem ipsum dolor Lorem ipsum dolor sit amet.',
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
      comment:'Lorem ipsum aliqua. Cing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
      comment:'Laoreet sit amet cursus sit amet dictum sit amet. amet, consectetur adipiscing elit.',
      date: '2021-05-27 21:40:00',
    },
    {
      id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
      pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
      comment:'Lorem ipsum dolor conna aliqua. Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt.',
      date: '2021-05-27 21:40:00',
    },
    ]);
  },
};