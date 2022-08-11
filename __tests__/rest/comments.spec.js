const {
  tables,
} = require('../../src/data');
const {
  withServer,
  login,
} = require('../supertest.setup');
//
const data = {
  comments: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
    comment: 'Test comment 1',
    date: new Date(2021, 4, 25, 19, 40),
  },
  {
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
    pin_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
    comment: 'Test comment 2',
    date: new Date(2021, 5, 25, 19, 40),
  },
  ],
  pins:[{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
    user_id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
    title: 'Test pin 1',
    description: 'This is some random text',
    fav:1,
    date: new Date(2021, 4, 25, 19, 40),
  }]
};
const dataToDelete = {
  comments: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
    '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
  ],
  pins:['7f28c5f9-d711-4cd6-ac15-d13d71abff89'],
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

  beforeEach(async () => {
    await knex(tables.pin).insert(data.pins);
    await knex(tables.comment).insert(data.comments);
  });

  afterEach(async () => {
    await knex(tables.comment)
    .whereIn('id', dataToDelete.comments)
    .delete();
    await knex(tables.pin)
      .whereIn('id', dataToDelete.pins)
      .delete();
     await knex(tables.comment)
        .whereIn('id', commentsToDelete)
        .delete();
  });
  const commentsToDelete = [];

  const url = '/api/comments';

  describe('GET/api/comments', () => {
    // beforeEach(async () => {
    //   await knex(tables.pin).insert(data.pins);
    //   await knex(tables.comment).insert(data.comments);
    // });
    // afterEach(async () => {
    //   await knex(tables.comment)
    //   .whereIn('id', dataToDelete.comments)
    //   .delete();
    //   await knex(tables.pin)
    //     .whereIn('id', dataToDelete.pins)
    //     .delete();
    // });

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
      expect(response.body.data.length).toBe(1);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);


      expect(response.body.data[0]).toEqual({"comment": "Test comment 2", "date": "2021-06-25T17:40:00.000Z", "id": "7f28c5f9-d711-4cd6-ac15-d13d71abff87", 
      "pin": {"id": "7f28c5f9-d711-4cd6-ac15-d13d71abff89", "title": "Test pin 1"}});
    });
  });

  describe('GET/api/comments/:id', () => {

    // beforeEach(async () => {  
    //   await knex(tables.pin).insert(data.pins);
    //   await knex(tables.comment).insert(data.comments);
    // });

    // afterEach(async () => {
    //   await knex(tables.comment)
    //   .whereIn('id', dataToDelete.comments)
    //   .delete();
    //   await knex(tables.pin)
    //     .where('id', dataToDelete.pins)
    //     .delete();
    // });

    test('it should 200 and return the requested comment', async () => {
      const commentId = data.comments[0].id;
      const response = await request.get(`${url}/${commentId}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.comment).toEqual(data.comments[0].comment);
      expect(response.body.pin.id).toEqual(data.comments[0].pin_id);
    });
  });

  describe('POST/api/comments', () => {

   // const commentsToDelete = [];
    // beforeEach(async () => {
    //   await knex(tables.pin).insert(data.pins[0]);
    // });

    // afterEach(async () => {
    //   await knex(tables.comment)
    //     .whereIn('id', commentsToDelete)
    //     .delete();

    //   await knex(tables.pin)
    //     .whereIn('id', dataToDelete.pins)
    //     .delete();
    // });

    test('it should 201 and return the created comment', async () => {
      const response = await request.post(url).set('Authorization', loginHeader)
        .send({
          comment: 'test comment',
          date: new Date(2021, 6, 25, 19, 40),
          pinId: data.pins[0].id
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.comment).toBe('test comment');
      expect(response.body.date).toBe(new Date(2021, 6, 25, 19, 40).toJSON());
      expect(response.body.pin.id).toBeTruthy();

      commentsToDelete.push(response.body.id);
    });
  });

  describe('PUT/api/comments/:id', () => {

    // beforeEach(async () => {
    //   await knex(tables.pin).insert(data.pins);
    //   await knex(tables.comment).insert(data.comments);
    // });

    // afterEach(async () => {
    //   await knex(tables.comment)
    //   .whereIn('id', dataToDelete.comments)
    //   .delete();

    //     await knex(tables.pin)
    //     .whereIn('id', dataToDelete.pins)
    //     .delete();
    // });

    test('it should 200 and return the updated comment', async () => {
      const response = await request.put(`${url}/${data.comments[0].id}`)
        .set('Authorization', loginHeader).send({
          pinId: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
          comment: 'test edit',
          date: new Date(2021, 4, 27, 19, 40),
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.comment).toBe('test edit');
      expect(response.body.date).toBe(new Date(2021, 4, 27, 19, 40).toJSON());
      expect(response.body.pin.title).toEqual(data.pins[0].title);
    });
  });


  describe('DELETE /api/comments/:id', () => {

    // beforeEach(async () => {
    //   await knex(tables.pin).insert(data.pins);
    //   await knex(tables.comment).insert(data.comments);
    // });

    // afterEach(async () => {
    //   await knex(tables.comment)
    //   .whereIn('id', dataToDelete.comments)
    //   .delete();
    //   await knex(tables.pin)
    //     .whereIn('id', dataToDelete.pins)
    //     .delete();
    // });

    test('it should delete the comment and 204 and return nothing', async () => {
      const response = await request.delete(`${url}/${data.comments[0].id}`).set('Authorization', loginHeader);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });

  });
});