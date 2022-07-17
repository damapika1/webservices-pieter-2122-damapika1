const uuid = require('uuid');

const {
  getChildLogger,
} = require('../core/logging');
const {
  getKnex,
  tables,
} = require('../data/index');

const SELECT_COLUMNS = [
  `${tables.comment}.id`, 'comment',`${tables.comment}.date AS date`,
  `${tables.pin}.id AS pin_id`, `${tables.pin}.title AS pin_title`,
];

const formatTransaction = ({
  pin_id,
  pin_title,
  ...comment
}) => {
  return {
    ...comment,
    pin: {
      id: pin_id,
      title: pin_title,
    },
  };
};

const findAll = async ({
  limit,
  offset,
}) => {
  const comments = await getKnex()(tables.comment)
    .select(SELECT_COLUMNS)
    .join(tables.pin, `${tables.comment}.pin_id`, '=', `${tables.pin}.id`)
    .limit(limit)
    .offset(offset)
    .orderBy('date', 'ASC');
  return comments.map(formatTransaction);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.comment)
    .count();

  return count['count(*)'];
};

const findById = async (id) => {
  const comment = await getKnex()(`${tables.comment}`)
    .join(`${tables.pin}`, `${tables.pin}.id`, '=', `${tables.comment}.pin_id`)
    .where(`${tables.comment}.id`, id)
    .first(SELECT_COLUMNS);

  return comment && formatTransaction(comment);
};

const create = async ({
  comment,
  date,
  pinId,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.comment).insert({
      id,
      pin_id: pinId,
      comment,
      date,
    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('comments-repo');
    logger.error('Error in create comment', {
      error,
    });
    throw error;

  }
};

const updateById = async (id, {
  pinId,
  comment,
  date,

}) => {
  try {
    await getKnex()(tables.comment)
      .update({
        pin_id: pinId,
        comment,
        date,
      })
      .where(`${tables.comment}.id`, id).andWhere(`${tables.comment}.pin_id`, pinId);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('comments-repo');
    logger.error('Error in comments updateById', {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.comment)
      .delete()
      .where(`${tables.comment}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('comments-repo');
    logger.error('Error in pins deleteById', {
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