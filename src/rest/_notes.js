const Router = require('@koa/router');
const noteService = require('../service/note');

const getAllNotes = async (ctx) => {
  const {
    limit,
    offset
  } = ctx.query;
  ctx.body = await noteService.getAll(Number(limit), Number(offset));
};
const getNotesById = async(ctx)=>{
ctx.body= await noteService.getById(ctx.params.id);
};