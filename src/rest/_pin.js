const Router = require('@koa/router');
const Joi = require('joi');

const pinService = require('../service/pin');
const {
  requireAuthentication,
} = require('../core/auth');

const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: Pins
 *   description: Represents pins that can be pinned by the user on a dashboard
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pin:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - title
 *             - date
 *             - fav
 *             - user
 *           properties:
 *             title:
 *               type: "string"
 *             date:
 *               type: "string"
 *               format: date-time
 *             fav:
 *               type: "boolean"
 *             description:
 *               type: "string"
 *             user:
 *               $ref: "#/components/schemas/User"
 *           example:
 *             $ref: "#/components/examples/Pin"
 *     PinsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Pin"
 *   examples:
 *     Pin:
 *       id: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca04"
 *       title: Pin title
 *       description: Pin description
 *       fav: false
 *       date: "2021-05-28T14:27:32.534Z"
 *       user:
 *         $ref: "#/components/examples/User" 
 *   requestBodies:
 *     Pin:
 *       description: The pin info to save.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: This is a title
 *               description:
 *                 type: string
 *                 example: This is a description
 *               fav:
 *                 type: boolean
 *               date:
 *                 type: string
 *                 format: "date-time"
 */

/**
 * @swagger
 * /api/pins:
 *   get:
 *     summary: Get all pins (paginated)
 *     tags:
 *     - Pins
 *     parameters:
 *       - $ref: "#/components/parameters/limitParam"
 *       - $ref: "#/components/parameters/offsetParam" 
 *     responses:
 *       400:
 *         description: User wasn't logged in
 *       200:
 *         description: List of pins
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PinsList"
 */

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

/**
 * @swagger
 * /api/pins:
 *   post:
 *     summary: Create a new pin
 *     tags:
 *     - Pins
 *     requestBody:
 *       $ref: "#/components/requestBodies/Pin"
 *     responses:
 *       400:
 *         description: User wasn't logged in
 *       201:
 *         description: created pin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pin"
 */

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
    // userId:Joi.string().uuid(),
  },

};
/**
 * @swagger
 * /api/pins/{id}:
 *   get:
 *     summary: Find pin by id
 *     tags:
 *     - Pins
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The pin ID.
 *     responses:
 *       400:
 *         description: User wasn't logged in
 *       200:
 *         description: Find pin by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pin"
 */

const getPinById = async (ctx) => {
  ctx.body = await pinService.getById(ctx.params.id);
};

getPinById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
/**
 * @swagger
 * /api/pins/{id}:
 *   put:
 *     summary: Update an existing pin
 *     tags:
 *     - Pins
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The pin ID.
 *     requestBody:
 *       $ref: "#/components/requestBodies/Pin"
 *     responses:
 *       200:
 *         description: Update an existing pin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Pin"
 *       400:
 *         description: User wasn't logged in
 */
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
    // userId:Joi.string().uuid(),
    
  },
};
/**
 * @swagger
 * /api/pins/{id}:
 *   delete:
 *     summary: Delete an existing pin
 *     tags:
 *     - Pins
 *     parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: The pin ID.
 *     responses:
 *       204:
 *         description: Deleted an existing pin
 *       400:
 *         description: User wasn't logged in
 */
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