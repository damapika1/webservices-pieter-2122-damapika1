const {
  getChildLogger
} = require('../core/logging');
const {
  getKnex,
  tables
} = require('../data/index');
const uuid = require('uuid');

const findAll = ({
  limit,
  offset
}) => {
  return getKnex()(tables.user)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('name', 'ASC');
};

const findCount = async () => {
  const [count] = await getKnex()(tables.user)
    .count();
  return count['count(*)'];
};

const findById = (id) => {
  return getKnex()(tables.user)
    .where('id', id)
    .first();
};

const create = async ({
  name,
}) => {
  try {
    const id = uuid.v4();
    await getKnex()(tables.user)
      .insert({
        id,
        name,
      });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('users-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

const updateById = async (id, {
  name,
}) => {
  try {
    await getKnex()(tables.user)
      .update({
        name,
      })
      .where('id', id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('users-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};


const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.user)
      .delete()
      .where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('users-repo');
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