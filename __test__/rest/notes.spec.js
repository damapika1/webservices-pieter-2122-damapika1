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
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'This is my second note',
    text: 'This is some random text 2',
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'This is my third note',
    text: 'This is some random text 3',
    date: new Date(2021, 4, 25, 19, 40),
  }
  ],
  users:[
    {
      id:'7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      name:'Rayme Emin'
    },
  ]
}
const dataToDelete = {
  notes: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
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
      await knex(tables.user).insert(data.users);
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
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    });


    test('it should 200 and paginate the list of notes', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      
      expect(response.body.data[0]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
        user:{
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name:'Rayme Emin'},
        title: 'This is my third note',
        text: 'This is some random text 3',
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
      expect(response.body.data[1]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
        user:{id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
              name:'Rayme Emin'},
        title: 'This is my first note',
        text: 'I love writing cute notes <3',
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('GET /api/notes/:id', () => {

    beforeAll(async () => {
      // await knex(tables.place).insert(data.places);
      await knex(tables.user).insert(data.users);
      await knex(tables.note).insert(data.notes[0]);
    });

    afterAll(async () => {
      await knex(tables.note)
        .where('id', dataToDelete.notes[0])
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return the requested note', async () => {
      const noteId = data.notes[0].id;
      const response = await request.get(`${url}/${noteId}`)

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: noteId,
        user: {id:'7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        name:'Rayme Emin'
      },
      title: 'This is my first note',
      text: 'I love writing cute notes <3',
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  })

  describe('POST /api/notes', () => {

    const notesToDelete = [];
    const usersToDelete = [];

    // beforeAll(async () => {
    //   await knex(tables.place).insert(data.places);
    // });

    afterAll(async () => {
      await knex(tables.note)
        .whereIn('id', notesToDelete)
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();

      await knex(tables.user)
        .whereIn('id', usersToDelete)
        .delete();
    });
/*
    test('it should 201 and return the created note', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
          user: 'Test User'
        });

        // id:'7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        // name:'Rayme Emin'

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
    */
  });
});