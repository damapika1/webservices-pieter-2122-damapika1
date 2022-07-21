const Router = require('@koa/router');
const Joi = require('joi');

const pinService = require('../service/pin');
const {
  requireAuthentication,
} = require('../core/auth');

const validate = require('./_validation');

const getAllPins = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await pinService.getAll(limit, offset);
};
getAllPins.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createPin = async (ctx) => {
  const newPin= await pinService.create({
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newPin;
  ctx.status = 201;
};
createPin.validationScheme = {
  body: {
    title: Joi.string().min(2).max(50),
    description:Joi.string().max(255).optional(),
    fav:Joi.boolean(),
    date: Joi.date().iso().less('now'),
  },

};

const getPinById = async (ctx) => {
  ctx.body = await pinService.getById(ctx.params.id);
};

getPinById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updatePin = async (ctx) => {
  ctx.body = await pinService.updateById(ctx.params.id, {
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    date: new Date(ctx.request.body.date),
  });
};

updatePin.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    title: Joi.string().min(2).max(50),
    description:Joi.string().max(255).optional(),
    fav:Joi.boolean(),
    date: Joi.date().iso().less('now'),
    
  },
};

const deletePin = async (ctx) => {
  await pinService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deletePin.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/pins',
  });

  router.get('/',requireAuthentication,  validate(getAllPins.validationScheme), getAllPins);
  router.post('/',requireAuthentication,  validate(createPin.validationScheme), createPin);
  router.get('/:id',requireAuthentication, validate(getPinById.validationScheme), getPinById);
  router.put('/:id',requireAuthentication, validate(updatePin.validationScheme), updatePin);
  router.delete('/:id', requireAuthentication, validate(deletePin.validationScheme), deletePin);
  app.use(router.routes()).use(router.allowedMethods());
};