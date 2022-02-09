const {
  getChildLogger
} = require('../core/logging');
const {
  getKnex,
  tables
} = require('../data');
const uuid = require('uuid');

SELECT_COLUMNS = [
  /*notes:*/
  `${tables.note}.id`, 'title', 'text', 'date',
  /*users:*/
  `${tables.user}.id AS user_id`, `${tables.user}.name AS user_name`,
];

const formatTransaction = ({
  user_id,
  user_name,
  ...note
}) => {
  return {
    ...note,
    user: {
      id: user_id,
      name: user_name,
    }
  }
}

const findAll = ({
  limit,
  offset
}) => {
  return getKnex()(tables.note)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('title', 'ASC');
};

const findById = async (id) => {
  const notes = await getKnex()(`${tables.note}`)
    .join(`${tables.user}`, `${tables.user}.id`, '=', `${tables.note}.user_id`)
    .where(`${tables.note}.id`, id)
    .first(SELECT_COLUMNS);

  return notes && formatTransaction(notes);
};

const create = async ({
  title,
  text,
  date,
  userId
}) => {
  try {
    const id = uuid.v4();
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
    const logger = getChildLogger('transactions-repo');
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
  findById,
  create,
  deleteById,
  updateById,
};