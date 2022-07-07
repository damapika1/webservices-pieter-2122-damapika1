const Router = require('@koa/router');
const Joi = require('joi');

const noteService = require('../service/note');
const {
  requireAuthentication,
} = require('../core/auth');

const validate = require('./_validation');

const getAllNotes = async (ctx) => {
  const limit = ctx.query.limit && Number(ctx.query.limit);
  const offset = ctx.query.offset && Number(ctx.query.offset);
  ctx.body = await noteService.getAll(limit, offset);
};
getAllNotes.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().integer().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};

const createNote = async (ctx) => {
  const newNote = await noteService.create({
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    // date: new Date(ctx.request.body.date),
  });
  ctx.body = newNote;
  ctx.status = 201;
};
createNote.validationScheme = {
  body: {
    text: Joi.string().min(5).max(255),
    pinId:Joi.string().uuid(),
  },

};

const getNoteById = async (ctx) => {
  ctx.body = await noteService.getById(ctx.params.id);
};

getNoteById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const updateNote = async (ctx) => {
  ctx.body = await noteService.updateById(ctx.params.id, {
    ...ctx.request.body,
    // userId: ctx.state.session.userId,
    // date: new Date(ctx.request.body.date),
  });
};

updateNote.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    text: Joi.string().min(5).max(255),
  },
};

const deleteNote = async (ctx) => {
  await noteService.deleteById(ctx.params.id);
  ctx.status = 204;
};

deleteNote.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/notes',
  });

  router.get('/', requireAuthentication, validate(getAllNotes.validationScheme), getAllNotes);
  router.post('/', requireAuthentication, validate(createNote.validationScheme), createNote);
  router.get('/:id', requireAuthentication, validate(getNoteById.validationScheme), getNoteById);
  router.put('/:id', requireAuthentication, validate(updateNote.validationScheme), updateNote);
  router.delete('/:id', requireAuthentication, validate(deleteNote.validationScheme), deleteNote);
  
  // router.get('/', validate(getAllNotes.validationScheme), getAllNotes);
  // router.post('/', validate(createNote.validationScheme), createNote);
  // router.get('/:id', validate(getNoteById.validationScheme), getNoteById);
  // router.put('/:id', validate(updateNote.validationScheme), updateNote);
  // router.delete('/:id', requireAuthentication, validate(deleteNote.validationScheme), deleteNote);
  
  app.use(router.routes()).use(router.allowedMethods());
};