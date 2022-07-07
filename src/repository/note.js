const uuid = require('uuid');

const {
  getChildLogger,
} = require('../core/logging');
const {
  getKnex,
  tables,
} = require('../data/index');

const SELECT_COLUMNS = [
  `${tables.note}.id`, 'text',
  `${tables.pin}.id AS pin_id`,
];

const formatTransaction = ({
  pin_id,
  // user_name,
  // user_email,
  ...note
}) => {
  return {
    ...note,
    pin: {
      id: pin_id,
      // name: user_name,
      // email: user_email,
    },
  };
};

const findAll = async ({
  limit,
  offset,
}) => {
  const notes = await getKnex()(tables.note)
    .select(SELECT_COLUMNS)
    .join(tables.pin, `${tables.note}.pin_id`, '=', `${tables.pin}.id`)
    .limit(limit)
    .offset(offset);
  // .orderBy('date', 'ASC');
  return notes.map(formatTransaction);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.note)
    .count();

  return count['count(*)'];
};

const findById = async (id) => {
  const note = await getKnex()(`${tables.note}`)
    .join(`${tables.pin}`, `${tables.pin}.id`, '=', `${tables.note}.pin_id`)
    .where(`${tables.note}.id`, id)
    .first(SELECT_COLUMNS);

  return note && formatTransaction(note);
};

const create = async ({
  text,
  pinId,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.note).insert({
      id,
      pin_id: pinId,
      text,
    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('notes-repo');
    logger.error('Error in create note', {
      error,
    });
    throw error;

  }
};

const updateById = async (id, {
  pinId,
  text,

}) => {
  try {
    await getKnex()(tables.note)
      .update({
        pin_id: pinId,
        text,
      })
      .where(`${tables.note}.id`, id).andWhere(`${tables.note}.pin_id`, pinId);
    return await findById(id);//.where(`${tables.note}.pin_id`, pinId);
  } catch (error) {
    const logger = getChildLogger('notes-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.note)
      .delete()
      .where(`${tables.note}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('notes-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};