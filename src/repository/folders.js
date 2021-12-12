const {
  getKnex,
  tables
} = require('../data');

SELECT_COLUMNS=[
  /*folders:*/`${tables.folder}.id`,
  /*notes:*/`${tables.note}.id AS note_id`,`${tables.note}.title AS note_title`,
  /*users:*/`${tables.user}.id AS user_id`,`${tables.user}.name AS user_name`,
];

const findById = async(id) => {
  const notes = await getKnex()(tables.note)
  .where('id',id)
  .first(SELECT_COLUMNS);
  
return folders;
};

module.exports = {
  findAll,
};