const {
  tables,
} = require('../../src/data');
const {
  withServer,
  login,
} = require('../supertest.setup');

const data = {
  notes: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'This is my first note',
    text: 'This is some random text',
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'This is my second note',
    text: 'This is some random text 2',
    date: new Date(2021, 5, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'This is my third note',
    text: 'This is some random text 3',
    date: new Date(2021, 6, 25, 19, 40),
  },
  ],
  // users: [{
  //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
  //   name: 'Rayme Emin',
  //   email: 'rayme.emin@student.hogent.be',
  //   password_hash:
  // '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
  //   roles: JSON.stringify([Roles.ADMIN, Roles.USER]),
  // }, ]
};
const dataToDelete = {
  notes: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
  ],
  users: ['7f28c5f9-d711-4cd6-ac15-d13d71abff80'],
};

describe('Notes', () => {
  let request;
  let knex;
  let loginHeader;

  withServer(({
    knex: k,
    supertest: s,
  }) => {
    request = s;
    knex = k;
  });
  beforeAll(async () => {
    loginHeader = await login(request);
  });

  const url = '/api/notes';
  describe('GET/api/notes', () => {
    beforeAll(async () => {
      await knex(tables.note).insert(data.notes);
    });
    afterAll(async () => {
      await knex(tables.note)
        .whereIn('id', dataToDelete.notes)
        .delete();
    });

    test('it should 200 and return all notes', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    });


    test('it should 200 and paginate the list of notes', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);

      expect(response.body.data[0]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name: 'Test User',
        },
        title: 'This is my second note',
        text: 'This is some random text 2',
        date: new Date(2021, 5, 25, 19, 40).toJSON(),
      });
      expect(response.body.data[1]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name: 'Test User',
        },
        title: 'This is my third note',
        text: 'This is some random text 3',
        date: new Date(2021, 6, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('GET /api/notes/:id', () => {

    beforeAll(async () => {
      // await knex(tables.place).insert(data.places);
      await knex(tables.note).insert(data.notes[0]);
    });

    afterAll(async () => {
      await knex(tables.note)
        .where('id', dataToDelete.notes[0])
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();
    });

    test('it should 200 and return the requested note', async () => {
      const noteId = data.notes[0].id;
      const response = await request.get(`${url}/${noteId}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: noteId,
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name: 'Test User',
        },
        title: 'This is my first note',
        text: 'This is some random text',
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('POST /api/notes', () => {

    const notesToDelete = [];

    afterAll(async () => {
      await knex(tables.note)
        .whereIn('id', notesToDelete)
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();ya
    });

    test('it should 201 and return the created note', async () => {
      const response = await request.post(url)
        .send({
          title: 'test',
          text: 'test-text',
          date: new Date(2021, 6, 25, 19, 40).toJSON(),
        }).set('Authorization', loginHeader);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('test');
      expect(response.body.text).toBe('test-text');
      expect(response.body.date).toBe(new Date(2021, 6, 25, 19, 40).toJSON());
      // expect(response.body.place).toEqual({
      //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
      //   name: 'Test place',
      // });
      expect(response.body.user.id).toBeTruthy();
      // expect(response.body.user.name).toBe('Test User');

      notesToDelete.push(response.body.id);
      //  usersToDelete.push(response.body.user.id);
    });
  });

  describe('PUT /api/notes/:id', () => {
    //const usersToDelete = [];

    beforeAll(async () => {
      //  await knex(tables.place).insert(data.places);
      // await knex(tables.user).insert(data.users);
      await knex(tables.note).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        title: 'This is my first note',
        text: 'This is some random text',
        date: new Date(2021, 4, 27, 19, 40),
      }]);
    });

    afterAll(async () => {
      await knex(tables.note)
        .where('id', '7f28c5f9-d711-4cd6-ac15-d13d71abff83')
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();

      // await knex(tables.user)
      //   .whereIn('id', [...dataToDelete.users, ...usersToDelete])
      //   .delete();
    });

    test('it should 200 and return the updated note', async () => {
      const response = await request.put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff83`)
        .send({
          //user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          title: 'test',
          text: 'test-text',
          date: new Date(2021, 4, 27, 19, 40),
        }).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('test');
      expect(response.body.text).toBe('test-text');
      expect(response.body.date).toBe(new Date(2021, 4, 27, 19, 40).toJSON());
      // expect(response.body.place).toEqual({
      //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
      //   name: 'Test place',
      // });
      expect(response.body.user.name).toEqual('Test User');

      // usersToDelete.push(response.body.user.id);
    });
  });


  describe('DELETE /api/notes/:id', () => {

    beforeAll(async () => {
      //  await knex(tables.place).insert(data.places);
      //await knex(tables.user).insert(data.users);

      await knex(tables.note).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
        title: 'test title',
        text: 'test text',
        date: new Date(2021, 4, 25, 19, 40),
        //  place_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
      }]);
    });

    afterAll(async () => {
      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();
      //   await knex(tables.user)
      //     .whereIn('id', dataToDelete.users)
      //     .delete();
    });

    test('it should delete note and 204 and return nothing', async () => {
      const response = await request.delete(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`).set('Authorization', loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

  });
});