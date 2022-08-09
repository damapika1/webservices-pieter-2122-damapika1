const {
  tables,
} = require('../../src/data');
const {
  withServer,
  login,
} = require('../supertest.setup');

const data = {
  pins: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'Test pin 1',
    description: 'This is some random text',
    fav:true,
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'Test pin 2',
    description: 'This is some random text 2',
    fav:false,
    date: new Date(2021, 5, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'Test pin 3',
    description: 'This is some random text 3',
    fav:false,
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
  pins: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
  ],
  users: ['7f28c5f9-d711-4cd6-ac15-d13d71abff80'],
};

describe('Pins', () => {
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

  const url = '/api/pins';
  describe('GET/api/pins', () => {
    beforeAll(async () => {
      await knex(tables.pin).insert(data.pins);
    });
    afterAll(async () => {
      await knex(tables.pin)
        .whereIn('id', dataToDelete.pins)
        .delete();
    });

    test('it should 200 and return all pins', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(3);
    });


    test('it should 200 and paginate the list of pins', async () => {
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
          email: 'test.user@hogent.be',
        },
        title: 'Test pin 2',
        description: 'This is some random text 2',
        fav:0,
        date: new Date(2021, 5, 25, 19, 40).toJSON(),
      });
      expect(response.body.data[1]).toEqual({
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name: 'Test User',
          email: 'test.user@hogent.be',
        },
        title: 'Test pin 3',
        fav:0,
        description: 'This is some random text 3',
        date: new Date(2021, 6, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('GET/api/pins/:id', () => {

    beforeAll(async () => {
      // await knex(tables.place).insert(data.places);
      await knex(tables.pin).insert(data.pins[0]);
    });

    afterAll(async () => {
      await knex(tables.pin)
        .where('id', dataToDelete.pins[0])
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();
    });

    test('it should 200 and return the requested pin', async () => {
      const pinId = data.pins[0].id;
      const response = await request.get(`${url}/${pinId}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: pinId,
        user: {
          id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          name: 'Test User',
          email: 'test.user@hogent.be',
        },
        title: 'Test pin 1',
        fav:1,
        description: 'This is some random text',
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  });

  describe('POST/api/pins', () => {

    const pinsToDelete = [];

    afterAll(async () => {
      await knex(tables.pin)
        .whereIn('id', pinsToDelete)
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();ya
    });

    test('it should 201 and return the created pin', async () => {
      const response = await request.post(url).set('Authorization', loginHeader)
        .send({
          title: 'test',
          description: 'test-text',
          fav:false,
          date: new Date(2021, 6, 25, 19, 40),
          // userId:'7f28c5f9-d711-4cd6-ac15-d13d71abff80'
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('test');
      expect(response.body.description).toBe('test-text');
      expect(response.body.fav).toBe(0);
      expect(response.body.date).toBe(new Date(2021, 6, 25, 19, 40).toJSON());
      // expect(response.body.place).toEqual({
      //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
      //   name: 'Test place',
      // });
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe('Test User');

      pinsToDelete.push(response.body.id);
      // usersToDelete.push(response.body.user.id);
    });
  });

  describe('PUT/api/pins/:id', () => {
    const usersToDelete = [];

    beforeAll(async () => {
      //  await knex(tables.place).insert(data.places);
      // await knex(tables.user).insert(data.users);
      await knex(tables.pin).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
        user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
        title: 'Test pin to update',
        description: 'This is some random text',
        fav:0,
        date: new Date(2021, 4, 27, 19, 40),
      }]);
    });

    afterAll(async () => {
      await knex(tables.pin)
        .where('id', '7f28c5f9-d711-4cd6-ac15-d13d71abff87')
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();

      // await knex(tables.user)
      //   .whereIn('id', [...dataToDelete.users, ...usersToDelete])
      //   .delete();
    });

    test('it should 200 and return the updated pin', async () => {
      const response = await request.put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff87`)
        .set('Authorization', loginHeader).send({
          //user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
          title: 'test',
          description: 'test-text',
          fav:0,
          date: new Date(2021, 4, 27, 19, 40),
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('test');
      expect(response.body.description).toBe('test-text');
      expect(response.body.fav).toBe(0);
      expect(response.body.date).toBe(new Date(2021, 4, 27, 19, 40).toJSON());
      // expect(response.body.place).toEqual({
      //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
      //   name: 'Test place',
      // });
      expect(response.body.user.name).toEqual('Test User');

      usersToDelete.push(response.body.user.id);
    });
  });


  describe('DELETE /api/pins/:id', () => {

    beforeAll(async () => {
      //  await knex(tables.place).insert(data.places);
      //await knex(tables.user).insert(data.users);

      await knex(tables.pin).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
        title: 'test title',
        description: 'test text',
        date: new Date(2021, 4, 25, 19, 40),
        fav:0,
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

    test('it should delete the pin and 204 and return nothing', async () => {
      const response = await request.delete(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`).set('Authorization', loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

  });
});