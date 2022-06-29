const {
  getChildLogger
} = require('../core/logging');
const {
  getKnex,
  tables
} = require('../data/index');
const uuid = require('uuid');

SELECT_COLUMNS = [
  `${tables.note}.id`, 'title', 'text', 'date',
  `${tables.user}.id AS user_id`, `${tables.user}.name AS user_name`,
];

const formatTransaction = ({
  user_id,
  user_name,
  user_email,
  ...note
}) => {
  return {
    ...note,
    user: {
      id: user_id,
      name: user_name,
      email: user_email
    }
  }
}

const findAll = async ({
  limit,
  offset
}) => {
  const notes = await getKnex()(tables.note)
    .select(SELECT_COLUMNS)
    .join(tables.user, `${tables.note}.user_id`, '=', `${tables.user}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy('date', 'ASC');
  return notes.map(formatTransaction);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.note)
    .count();

  return count['count(*)'];
};

const findById = async (id) => {
  const note = await getKnex()(`${tables.note}`)
    .join(`${tables.user}`, `${tables.user}.id`, '=', `${tables.note}.user_id`)
    .where(`${tables.note}.id`, id)
    .first(SELECT_COLUMNS);

  return note && formatTransaction(note);
};

const create = async ({
  title,
  text,
  date,
  userId
}) => {
  try {
    const id = uuid.v4();
    //TODO: make userId not hardcoded
    const userId = '7f28c5f9-d711-4cd6-ac15-d13d71abff80';
    await getKnex()(tables.note).insert({
      id,
      user_id: userId,
      title,
      text,
      date,

    })
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('transactions-repo');
    logger.error('Error in create note', {
      error
    });
    throw error;

  }

};
const updateById = async (id, {
  userId,
  title,
  text,
  date,

}) => {
  try {
    await getKnex()(tables.note)
      .update({
        user_id: userId,
        title,
        text,
        date,
      })
      .where(`${tables.note}.id`, id);
    return await findById(id);
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
    const logger = getChildLogger('transactions-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
}

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};