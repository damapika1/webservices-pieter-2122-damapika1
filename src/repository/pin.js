const uuid = require('uuid');

const {
  getChildLogger,
} = require('../core/logging');
const {
  getKnex,
  tables,
} = require('../data/index');

const SELECT_COLUMNS = [
  `${tables.pin}.id`, 'title','description','fav', 'date',
  `${tables.user}.id AS user_id`, `${tables.user}.name AS user_name`,`${tables.user}.email AS user_email`,
];

const formatTransaction = ({
  user_id,
  user_name,
  user_email,
  ...pin
}) => {
  return {
    ...pin,
    user: {
      id: user_id,
      name: user_name,
      email: user_email,
    },
  };
};

const findAll = async ({
  limit,
  offset,
}) => {
  const pins = await getKnex()(tables.pin)
    .select(SELECT_COLUMNS)
    .join(tables.user, `${tables.pin}.user_id`, '=', `${tables.user}.id`)
    // .where(`${tables.pin}.id`, id).andWhere(`${tables.pin}.user_id`, userId)
    .limit(limit)
    .offset(offset)
    .orderBy('date', 'ASC');
  return pins.map(formatTransaction);
};

const findCount = async () => {
  const [count] = await getKnex()(tables.pin)
    .count();

  return count['count(*)'];
};

const findById = async (id) => {
  const pin = await getKnex()(`${tables.pin}`)
    .join(`${tables.user}`, `${tables.user}.id`, '=', `${tables.pin}.user_id`)
    .where(`${tables.pin}.id`, id)
    .first(SELECT_COLUMNS);

  return pin && formatTransaction(pin);
};

const create = async ({
  title,
  description,
  fav,
  date,
  userId,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.pin).insert({
      id,
      user_id: userId,
      title,
      description,
      fav,
      date,

    });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('pins-repo');
    logger.error('Error in create pin', {
      error,
    });
    throw error;

  }
};

const updateById = async (id, {
  title,
  description,
  fav,
  date,
  userId,
}) => {
  try {
    await getKnex()(tables.pin)
      .update({
        user_id: userId,
        title,
        description,
        fav,
        date,
      })
      .where(`${tables.pin}.id`, id)
      .andWhere(`${tables.pin}.user_id`, userId);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('pins-repo');
    logger.error('Error in pins updateById', {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.pin)
      .delete()
      .where(`${tables.pin}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('pins-repo');
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