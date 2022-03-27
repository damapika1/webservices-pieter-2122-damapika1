const Router = require('@koa/router');
const noteService = require('../service/note');

const getAllNotes = async (ctx) => {
	const limit =  ctx.query.limit && Number(ctx.query.limit);
    const offset =  ctx.query.offset && Number(ctx.query.offset);
	ctx.body = await noteService.getAll(limit, offset);
};

const createNote= async (ctx) => {
	const newNote = await noteService.create({
		...ctx.request.body,
		date: new Date(ctx.request.body.date),
	});
	ctx.body = newNote;
	ctx.status=201;
};

const getNoteById = async (ctx) => {
	ctx.body = await noteService.getById(ctx.params.id);
};

const updateNote = async (ctx) => {
	ctx.body = await noteService.updateById(ctx.params.id, {
		...ctx.request.body,
		date: new Date(ctx.request.body.date),
	});
};

const deleteNote = async (ctx) => {
	await noteService.deleteById(ctx.params.id);
	ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/notes',
	});

	router.get('/', getAllNotes);
	router.post('/', createNote);
	router.get('/:id', getNoteById);
	router.put('/:id', updateNote);
	router.delete('/:id', deleteNote);

	app.use(router.routes()).use(router.allowedMethods());
};

// const Router = require('@koa/router');
// const noteService = require('../service/note');

// const getAllNotes = async (ctx) => {
//   const {
//     limit,
//     offset
//   } = ctx.query;
//   ctx.body = await noteService.getAll(Number(limit), Number(offset));
// };
// const getNotesById = async(ctx)=>{
// ctx.body= await noteService.getById(ctx.params.id);
// };