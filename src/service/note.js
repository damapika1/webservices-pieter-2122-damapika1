const uuid = require('uuid');
const {
  getChildLogger
} = require('../core/logging');
const notesRepository = require('../repository/note');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('note-service');
  this.logger.debug(message, meta);
}

// let {
//   NOTES
// } = require('../data/mock_data');

const getAll = async (limit=100,offset=0) => {
  debugLog('Fetching all notes');
  const data = await notesRepository.findAll(limit,offset);
  return {data:data,count:data.length,}
}
const getById = async (id) => {
  debugLog(`Fetching all notes with id: ${id}`);
  return notesRepository.findById(id);
};
const create = async ({
  title,
  text,
  date
}) => {

  return new Promise((resolve) => {
    const newNote = {
      id: uuid.v4(),
      title,
      text,
      date //:date.toISOString(),
    };
    NOTES = [...NOTES, newNote];
    resolve(newNote);
  });
};
const updateById = async ({
  id,
  title,
  text,
  date
}) => {
  return new Promise((resolve) => {
    NOTES = NOTES.map((notes) => {
      return notes.id === id ? {
        ...notes,
        title,
        text,
        date,
      } : notes;
    });
    resolve(getById(id));
  })
}
const deleteById = async (id) => {
  debugLog(`Deleting a note with id ${id}`);
  await notesRepository.deleteById(id);
  // return new Promise((resolve) => {
  //   NOTES = NOTES.filter((n) => n.id !== id);
  //   resolve();
  // })
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById

};