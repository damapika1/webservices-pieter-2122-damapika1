const Router = require('@koa/router');
const Joi = require('joi');

const commentService = require('../service/comment');
const {
  requireAuthentication,
} = require('../core/auth');

const validate = require('./_validation');
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Represents comments that belong to a pin
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - comment
 *             - date
 *             - pin
 *           properties:
 *             comment:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: date-time
 *             pin:
 *               $ref: "#/components/schemas/Pin"
 *           example:
 *             $ref: "#/components/examples/Comment"
 *     CommentsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Comment"
 *   examples:
 *     Comment:
 *       id: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca04"
 *       comment: This is a comment
 *       date: "2021-05-28T14:27:32.534Z"
 *       pin:
 *         id: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca05"
 *         title: Pin title
 *   requestBodies:
 *     Comment:
 *       description: The comment info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: This is a comment
 *               date:
 *                 type: string
 *                 format: "date-time"
 *               pinId:
 *                 type: string
 *                 example: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca08"
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments (paginated)
 *     tags:
 *     - Comments
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam" 
 *     responses:
 *       400:
 *         description: User wasn't logged in
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentsList"
 */
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
/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *     - Comments
 *     requestBody:
 *       $ref: "#/components/requestBodies/Comment"
 *     responses:
 *       400:
 *         description: User wasn't logged in
 *       201:
 *         description: created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 */


const createComment = async (ctx) => {
  const newComment= await commentService.create({
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
  ctx.body = newComment;
  ctx.status = 201;
};
createComment.validationScheme = {
  body: {
    comment: Joi.string().allow(''),
    date: Joi.date().iso().less('now'),
    pinId:Joi.string().uuid(),
  },

};
/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Find comment by id
 *     tags:
 *     - Comments
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The comment ID.
 *       400:
 *         description: User wasn't logged in
 *     responses:
 *       200:
 *         description: Find comment by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 */
const getCommentById = async (ctx) => {
  ctx.body = await commentService.getById(ctx.params.id);
};

getCommentById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
/**
 * @swagger
 * /api/comment/{id}:
 *   put:
 *     summary: Update an existing comment
 *     tags:
 *     - Comments
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The comment ID.
 *     requestBody:
 *       $ref: "#/components/requestBodies/Comment"
 *     responses:
 *       400:
 *         description: User wasn't logged in
 *       200:
 *         description: Update an existing comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Comment"
 */
const updateComment = async (ctx) => {
  ctx.body = await commentService.updateById(ctx.params.id, {
    ...ctx.request.body,
    date: new Date(ctx.request.body.date),
  });
  
};

updateComment.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {
    comment: Joi.string().allow(''),
    date: Joi.date().iso().less('now'),
    pinId:Joi.string().uuid(),
  },
};
/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete an existing comment
 *     tags:
 *     - Comments
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The comment ID.
 *     responses:
 *       204:
 *         description: Successfully deleted the comment
 *       400:
 *         description: User wasn't logged in
 */
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