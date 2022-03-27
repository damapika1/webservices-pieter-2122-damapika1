const config = require('config');
const {
  getChildLogger
} = require('../core/logging');
const notesRepository = require('../repository/note');
const userService = require('./user');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('note-service');
  this.logger.debug(message, meta);
}

const getAll = async (limit = DEFAULT_PAGINATION_LIMIT , offset = DEFAULT_PAGINATION_OFFSET) => {
  debugLog('Fetching all notes');
  const data = await notesRepository.findAll(limit, offset);
  const count = await notesRepository.findCount();
  return {
    data,
    count,
    limit,
    offset
  }
}
const getById = async (id) => {
  debugLog(`Fetching all notes with id: ${id}`);
  const note = notesRepository.findById(id);
  if(!note){
    throw new Error(`There is no note with id ${id}`)
  }
  return note;
};

const create = async ({
  user,
  title,
  text,
  date
}) => {
  debugLog('Creating new note', {
    user,
    title,
    text,
    date
  });
  const { id: user_id } = await userService.register({ name: user });
  return notesRepository.create({
    title,
    text,
    date,
    user_id,//user_id na authentication
  });
};
const updateById = async (id,{
  userId,
  title,
  text,
  date

}) => {
  debugLog(`Updating a note with id ${id}`, {
  userId,
	title,
  text,
  date
	});
  return notesRepository.updateById(id,{
    userId,
    title,
    text,
    date,
   
  });
}
const deleteById = async (id) => {
  debugLog(`Deleting a note with id ${id}`);
  await notesRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById
};