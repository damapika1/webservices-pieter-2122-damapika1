const {
  tables,
} = require('../../src/data');
const {
  withServer,
  login,
} = require('../supertest.setup');
const Roles = require('../../src/core/roles');
const data = {
  users: [{
    id: '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
    name: 'Rayme Emin',
    email: 'rayme.emin@student.hogent.be',
    password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
    roles: JSON.stringify([Roles.ADMIN, Roles.USER]),
  },
  ],
};
const usersToDelete=[];

const dataToDelete = {
  users: [
    '7f28c5f9-d711-4cd6-ac15-d13d71abff89',
  ],
};

describe('Users', () => {
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
    await knex(tables.user).insert(data.users);
  });
  afterEach(async () => {
    await knex(tables.user)
      .whereIn('id', dataToDelete.users)
      .delete();
    await knex(tables.user)
      .whereIn('id', usersToDelete)
      .delete();
  });

  const url = '/api/users';

  describe('GET/api/users/:id', () => {

    test('it should 200 and return the requested user', async () => {
      const userId = data.users[0].id;
      const response = await request.get(`${url}/${userId}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.id).toEqual(data.users[0].id);
      expect(response.body.email).toEqual(data.users[0].email);
      expect(response.body.roles).toEqual(['admin','user']);
    });
  });

  describe('POST/api/users/login', () => {
    test('it should 200, login and return user', async () => {
      const response = await request.post(`${url}/login`)
        .send({
          email:'rayme.emin@student.hogent.be',
          password:'12345678',
        });
      expect(response.status).toBe(200);
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe('Rayme Emin');
      expect(response.body.user.email).toBe('rayme.emin@student.hogent.be');
    });
  });

  describe('POST/api/users/register', () => {

    test('it should 200, register and return user', async () => {
      const response = await request.post(`${url}/register`)
        .send({
          name:'Test name',
          email:'hogent@mail.com',
          password:'12345678', 
        });
      expect(response.status).toBe(200);
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe('Test name');
      expect(response.body.user.email).toBe('hogent@mail.com');
      usersToDelete.push(response.body.user.id);
    });
  });
  
});