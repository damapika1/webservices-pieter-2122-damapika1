let {
  NOTES
} = require('../data/mock_data');

const getAll = () => {
  return {
    data: NOTES,
    count: NOTES.length,
  }
};
const getById = (id) => {
  throw new Error('not implemented yet');
};
const create = (title, text, date) => {

  const newNote = {
    id: '',
    title,
    text,
    date: date.toISOString(),
  };
  NOTES = [...NOTES, newNote];
  return newNote;
};
const updateById = (id, title, text, date) => {
  throw new Error('not implemented yet');
}
const deleteById = (id) => {
  throw new Error('not implemented yet');
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById

};