const Router = require('@koa/router');
const Joi = require('joi');

const commentService = require('../service/comment');
const {
  requireAuthentication,
} = require('../core/auth');

const validate = require('./_validation');

const getAllComments = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await commentService.getAll(limit, offset);
};
getAllComments.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createComment = async (ctx) => {
  const newComment= await commentService.create({
    ...ctx.request.body,
    // pinId: ctx.state.session.pinId,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newComment;
  ctx.status = 201;
};
createComment.validationScheme = {
  body: {
    comment: Joi.string().allow(""),
    date: Joi.date().iso().less('now'),
    pinId:Joi.string().uuid(),
  },

};

const getCommentById = async (ctx) => {
  ctx.body = await commentService.getById(ctx.params.id);
};

getCommentById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateComment = async (ctx) => {
  ctx.body = await commentService.updateById(ctx.params.id, {
    ...ctx.request.body,
    // pinId: ctx.state.session.pinId,
    date: new Date(ctx.request.body.date),
  });
};

updateComment.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    comment: Joi.string().allow(""),
    date: Joi.date().iso().less('now'),
    pinId:Joi.string().uuid(),
  },
};

const deleteComment = async (ctx) => {
  await commentService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteComment.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/comments',
  });

  router.get('/',requireAuthentication,  validate(getAllComments.validationScheme), getAllComments);
  router.post('/',requireAuthentication,  validate(createComment.validationScheme), createComment);
  router.get('/:id',requireAuthentication, validate(getCommentById.validationScheme), getCommentById);
  router.put('/:id',requireAuthentication, validate(updateComment.validationScheme), updateComment);
  router.delete('/:id', requireAuthentication, validate(deleteComment.validationScheme), deleteComment);
  app.use(router.routes()).use(router.allowedMethods());
};