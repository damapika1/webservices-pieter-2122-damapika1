const Router = require('@koa/router');
const userService = require('../service/user');

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};
const createUser = async (ctx) => {
  const newUser = await userService.create({
    ...ctx.request.body
  });
  ctx.body = newUser;
  ctx.status = 201;
};

const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};

const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};


module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  router.get('/', getAllUsers);
  router.post('/', createUser);
  router.get('/:id', getUserById);
  router.put('/:id', updateUserById);
  router.delete('/:id', deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};