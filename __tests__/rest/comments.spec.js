const {
  tables,
} = require('../../src/data');
const {
  withServer,
  login,
} = require('../supertest.setup');

const data = {
  comments: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    comment: 'Test comment 1',
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    comment: 'Test comment 2',
    date: new Date(2021, 5, 25, 19, 40),
  },
  ],
  pins:[{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'Test pin 1',
    description: 'This is some random text',
    fav:true,
    date: new Date(2021, 4, 25, 19, 40),
  }]
};
const dataToDelete = {
  comments: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
  ],
  pins:['7f28c5f9-d711-4cd6-ac15-d13d71abff83'],
  users: ['7f28c5f9-d711-4cd6-ac15-d13d71abff80'],
};

describe('Comments', () => {
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

  const url = '/api/comments';

  describe('GET/api/comments', () => {
    beforeAll(async () => {
      await knex(tables.pin).insert(data.pins);
      await knex(tables.comment).insert(data.comments);
    });
    afterAll(async () => {
      await knex(tables.pin)
        .whereIn('id', dataToDelete.pins)
        .delete();
      await knex(tables.comment)
        .whereIn('id', dataToDelete.comments)
        .delete();
    });

    test('it should 200 and return all comments', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(100);
      expect(response.body.offset).toBe(0);
      expect(response.body.data.length).toBe(2);
    });


    test('it should 200 and paginate the list of comments', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual(data.comments[0]);
      expect(response.body.data[1]).toEqual(data.comments[1]);
    });
  });

  describe('GET/api/comments/:id', () => {

    beforeAll(async () => {
      
      await knex(tables.pin).insert(data.pins[0]);
      await knex(tables.comment).insert(data.comments);
    });

    afterAll(async () => {
      await knex(tables.pin)
        .where('id', dataToDelete.pins[0])
        .delete();

      await knex(tables.comment)
        .whereIn('id', dataToDelete.comments)
        .delete();
    });

    test('it should 200 and return the requested comment', async () => {
      const commentId = data.comments[0].id;
      const response = await request.get(`${url}/${commentId}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        data.comments[0]
      );
    });
  });

  describe('POST/api/comments', () => {

    const commentsToDelete = [];

    afterAll(async () => {
      await knex(tables.comment)
        .whereIn('id', commentsToDelete)
        .delete();

      // await knex(tables.place)
      //   .whereIn('id', dataToDelete.places)
      //   .delete();ya
    });

    test('it should 201 and return the created pin', async () => {
      const response = await request.post(url).set('Authorization', loginHeader)
        .send({
          comment: 'test comment',
          date: new Date(2021, 6, 25, 19, 40),
          pinId:'7f28c5f9-d711-4cd6-ac15-d13d71abff83'
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.comment).toBe('comment');
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

  describe('PUT/api/comments/:id', () => {
    // const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.pin).insert(data.pins);
      await knex(tables.comment).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
        pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
        comment: 'add new comment',
        date: new Date(2021, 4, 27, 19, 40),
      }]);
    });

    afterAll(async () => {
      await knex(tables.comment)
        .where('id', '7f28c5f9-d711-4cd6-ac15-d13d71abff88')
        .delete();

        await knex(tables.pin)
        .whereIn('id', dataToDelete.pins)
        .delete();
    });

    test('it should 200 and return the updated comment', async () => {
      const response = await request.put(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff88`)
        .set('Authorization', loginHeader).send({
          pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
          comment: 'test edit',
          date: new Date(2021, 4, 27, 19, 40),
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.comment).toBe('test edit');
      expect(response.body.date).toBe(new Date(2021, 4, 27, 19, 40).toJSON());
      // expect(response.body.place).toEqual({
      //   id: '7f28c5f9-d711-4cd6-ac15-d13d71abff90',
      //   name: 'Test place',
      // });
      expect(response.body.pin.title).toEqual(data.pins[0].title);

      // usersToDelete.push(response.body.user.id);
    });
  });


  describe('DELETE /api/comments/:id', () => {

    beforeAll(async () => {
      await knex(tables.pin).insert(data.pins);
      await knex(tables.comment).insert([{
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
        comment: 'comment',
        date: new Date(2021, 4, 25, 19, 40),
        pin_id: data.pins[0].id,
      }]);
    });

    afterAll(async () => {
      await knex(tables.pin)
        .whereIn('id', dataToDelete.pins)
        .delete();
    });

    test('it should delete the comment and 204 and return nothing', async () => {
      const response = await request.delete(`${url}/7f28c5f9-d711-4cd6-ac15-d13d71abff89`).set('Authorization', loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

  });
});