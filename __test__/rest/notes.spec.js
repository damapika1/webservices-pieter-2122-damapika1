const createServer = require('../../src/createServer');
const supertest = require('supertest');
const { getKnex, tables } = require('../../src/data');

const data ={
  notes:
  [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'This is my first note',
    text: 'I love writing cute notes <3',
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
  ]
}
const dataToDelete = {
  notes: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
  ],
  // places: ['7f28c5f9-d711-4cd6-ac15-d13d71abff90'],
  users: ['7f28c5f9-d711-4cd6-ac15-d13d71abff80']
};



describe('Note',()=>{
  let server;
  let request;
  let knex;

  beforeAll(async()=>{
    server=await createServer();
    knex= getKnex();
    request = supertest(server.getApp().callback());
  });

  afterAll(async()=>{
  await server.stop();
  });

  const url='/api/notes';
  describe('GET /api/notes', () => {
    beforeAll(async () => {
      // await knex(tables.place).insert(data.places);
      // await knex(tables.user).insert(data.users);
      await knex(tables.note).insert(data.notes);
    });

    afterAll(async () => {
      await knex(tables.note)
        .whereIn('id', dataToDelete.notes)
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return all notes', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      // expect(response.body.limit).toBe(100);
      // expect(response.body.offset).toBe(0);yarn
      expect(response.body.data.length).toBe(3);
    });


    test('it should 200 and paginate the list of notes', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff83",
            user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff80",
            title: "This is my first note",
            text: "I love writing cute notes <3",
            date: "2021-05-25T17:40:00.000Z"
        // id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
        // user: {
        //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        //   name: 'Test User',
        // },
        // place: {
        //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        //   name: 'Test place',
        // },
        // amount: -74,
        // date: new Date(2021, 4, 21, 14, 30).toJSON(),
      });
      expect(response.body.data[1]).toEqual({
        id: "7f28c5f9-d711-4cd6-ac15-d13d71abff84",
        user_id: "7f28c5f9-d711-4cd6-ac15-d13d71abff81",
        title: "This is my second note",
        text: "This is some random text 2",
        date: "2021-05-26T18:40:00.000Z"
    //     id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    //     user: {
    //       id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    //       name: 'Test User',
    //     },
    //     place: {
    //       id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
    //       name: 'Test place',
    //     },
    //     amount: 3500,
    //     date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('GET /api/notes/:id', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
      await knex(tables.user).insert(data.users);
      await knex(tables.transaction).insert(data.transactions[0]);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .where('id', dataToDelete.transactions[0])
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return the requested transaction', async () => {
      const transactionId = data.transactions[0].id;
      const response = await request.get(`${url}/${transactionId}`)

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: transactionId,
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name: 'Test User',
        },
        place: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
          name: 'Test place',
        },
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  })

  describe('POST /api/transactions', () => {

    const transactionsToDelete = [];
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .whereIn('id', transactionsToDelete)
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', usersToDelete)
        .delete();
    });

    test('it should 201 and return the created transaction', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
          user: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(102);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        name: 'Test place',
      });
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe('Test User');

      transactionsToDelete.push(response.body.id);
      usersToDelete.push(response.body.user.id);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
      await knex(tables.user).insert(data.users);
      await knex(tables.transaction).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
        amount: 102,
        date: new Date(2021, 4, 25, 19, 40),
        place_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      }]);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .where('id', '7f28c5f9-d711-4cd6-ac15-d13d71abff89')
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', [...dataToDelete.users, ...usersToDelete])
        .delete();
    });

    test('it should 200 and return the updated transaction', async () => {
      const response = await request.put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
          user: 'Test User'
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        name: 'Test place',
      });
      expect(response.body.user.name).toEqual('Test User');

      usersToDelete.push(response.body.user.id);
    });
  });


  describe('DELETE /api/transactions/:id', () => {

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
      await knex(tables.user).insert(data.users);

      await knex(tables.transaction).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
        amount: 102,
        date: new Date(2021, 4, 25, 19, 40),
        place_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      }]);
    });

    afterAll(async () => {
      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();
      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});