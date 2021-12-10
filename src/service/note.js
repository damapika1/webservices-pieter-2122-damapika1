const uuid = require('uuid');
let {
  NOTES
} = require('../data/mock_data');

const getAll = async () => {
  return Promise.resolve({
    data: NOTES,
    //count: NOTES.length,
  });
};
const getById = async (id) => {
  return Promise.resolve(NOTES.filter(n => n.id === id)[0]);
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
  return new Promise((resolve) => {
    NOTES = NOTES.filter((n) => n.id !== id);
    resolve();
  })
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById

};