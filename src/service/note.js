const config = require('config');
const {
  getChildLogger
} = require('../core/logging');
const notesRepository = require('../repository/note');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('note-service');
  this.logger.debug(message, meta);
}

const getAll = async (limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) => {
  debugLog('Fetching all notes');
  const data = await notesRepository.findAll({
    limit,
    offset
  });

  const count = await notesRepository.findCount();
  if (count === 0) {
    throw ServiceError.notFound(`There is no notes!`, {
      count
    });
  }
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
  if (!note) {
    throw ServiceError.notFound(`There is no note with id ${id}`, {
      id
    });
  }
  return note;
};

const create = async ({
  userId,
  title,
  text,
  date
}) => {
  debugLog('Creating new note', {
    userId,
    title,
    text,
    date
  });
  return notesRepository.create({
    title,
    text,
    date,
    userId,
  });
};
const updateById = async (id, {
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
  
  return notesRepository.updateById(id, {
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