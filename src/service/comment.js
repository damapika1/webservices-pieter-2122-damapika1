const config = require('config');

const {
  getChildLogger,
} = require('../core/logging');
const commentsRepository = require('../repository/comment');
const ServiceError = require('../core/serviceError');

const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('comment-service');
  this.logger.debug(message, meta);
};

const getAll = async (limit = DEFAULT_PAGINATION_LIMIT, offset = DEFAULT_PAGINATION_OFFSET) => {
  debugLog('Fetching all comments');
  const data = await commentsRepository.findAll({
    limit,
    offset,
  });

  const count = await commentsRepository.findCount();
  if (count === 0) {
    throw ServiceError.notFound('There is no comments!', {
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
  debugLog(`Fetching all comments with id: ${id}`);
  const comment = commentsRepository.findById(id);
  if (!comment) {
    throw ServiceError.notFound(`There is no comment with id ${id}`, {
      id,
    });
  }
  return comment;
};

const create = async ({
  pinId,
  comment,
  date,
}) => {
  debugLog('Creating new comment', {
    pinId,
    comment,
    date,
  });
  return commentsRepository.create({
    comment,
    date,
    pinId,
  });
};
const updateById = async (id, {
  pinId,
  comment,
  date,

}) => {
  debugLog(`Updating a comment with id ${id}`, {
    pinId,
    comment,
    date,
  });

  return commentsRepository.updateById(id, {
    pinId,
    comment,
    date,

  });
};
const deleteById = async (id) => {
  debugLog(`Deleting a comment with id ${id}`);
  await commentsRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};