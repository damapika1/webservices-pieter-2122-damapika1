const Router = require('@koa/router');
const Joi = require('joi');

const userService = require('../service/user');
const Role = require('../core/roles');
const {
  requireAuthentication,
  makeRequireRole,
} = require('../core/auth');

const validate = require('./_validation');
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents users 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "string"
 *             password_hash:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/User"
 *     UsersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *   examples:
 *     User:
 *       id: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca04"
 *       name: User name
 *       email: rayme.emin@student.hogent.be
 *       password_hash: $argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/
 *       roles:
 *         ["user","admin"]
 *   requestBodies:
 *     User:
 *       description: The user info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: User name
 *               email:
 *                 type: string
 *                 example: rayme.emin@student.hogent.be
 *               password_hash:
 *                 type: string
 *                 example: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/"
 *               roles:
 *                 type: arr
 *                 example: rayme.emin@student.hogent.be
 *     Register:
 *       description: The user info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: User name
 *               email:
 *                 type: string
 *                 example: rayme.emin@student.hogent.be
 *               password_hash:
 *                 type: string
 *                 example: "$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/"
 *               roles:
 *                 type: arr
 *                 example: ["user","admin"]
 */



/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Logs user into the system
 *     tags:
 *     - Users
 *     parameters:
 *     - in: query
 *       name: email
 *       schema:
 *         type: string
 *       required: true
 *       description: User e-mail
 *     - in: query
 *       name: password
 *       schema:
 *         type: string
 *       required: true
 *       description: User password
 *     responses:
 *       400:
 *         description: Invalid email and password supplied
 *       200:
 *         description: User log in successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const login = async (ctx) => {
  const {
    email,
    password,
  } = ctx.request.body;
  const response = await userService.login(email, password);
  ctx.body = response;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Create user
 *     tags:
 *     - Users
 *     requestBody:
 *       $ref: "#/components/requestBodies/Register"
 *     responses:
 *       200:
 *         description: Register successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const register = async (ctx) => {
  const response = await userService.register(ctx.request.body);
  ctx.body = response;
};
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Find user by id
 *     tags:
 *     - Users
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The user ID.
 *       400:
 *         description: User wasn't found
 *     responses:
 *       200:
 *         description: Find user by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
  },
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });
  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(register.validationScheme), register);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  // Routes with authentication/autorisation
  router.get('/', requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.put('/:id', requireAuthentication, validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', requireAuthentication, validate(deleteUserById.validationScheme), deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};