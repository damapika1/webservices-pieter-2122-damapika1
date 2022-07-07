const config = require('config');

const {
  getChildLogger,
} = require('../core/logging');
const pinsRepository = require('../repository/pin');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('pin-service');
  this.logger.debug(message, meta);
};

const getAll = async (limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) => {
  debugLog('Fetching all notes');
  const data = await pinsRepository.findAll({
    limit,
    offset,
  });

  const count = await pinsRepository.findCount();
  if (count === 0) {
    throw ServiceError.notFound('There is no pins!', {
      count,
    });
  }
  return {
    data,
    count,
    limit,
    offset,
  };
};
const getById = async (id) => {
  debugLog(`Fetching all pins with id: ${id}`);
  const pin = pinsRepository.findById(id);
  if (!pin) {
    throw ServiceError.notFound(`There is no pin with id ${id}`, {
      id,
    });
  }
  return pin;
};

const create = async ({
  userId,
  title,
  type,
  fav,
  date,
}) => {
  debugLog('Creating new pin', {
    userId,
    title,
    type,
    fav,
    date,
  });
  return pinsRepository.create({
    title,
    type,
    fav,
    date,
    userId,
  });
};
const updateById = async (id, {
  userId,
  title,
  type,
  fav,
  date,

}) => {
  debugLog(`Updating a pin with id ${id}`, {
    userId,
    title,
    type,
    fav,
    date,
  });

  return pinsRepository.updateById(id, {
    userId,
    title,
    type,
    fav,
    date,

  });
};
const deleteById = async (id) => {
  debugLog(`Deleting a pin with id ${id}`);
  await pinsRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};