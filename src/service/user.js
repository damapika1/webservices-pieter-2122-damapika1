const { getChildLogger } = require('../core/logging');
const userRepository = require('../repository/user');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

const register = ({
  name,
}) => {
  debugLog('Creating a new user', { name });
  return userRepository.create({
    name,
  });
};


 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all users', { limit, offset });
  const data = await userRepository.findAll({ limit, offset });
  const totalCount = await userRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

const getById = async (id) => {
  debugLog(`Fetching user with id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error(`No user with id ${id} exists`, { id });
  }

  return user;
};

const updateById = (id, { name, email }) => {
  debugLog(`Updating user with id ${id}`, { name, email });
  return userRepository.updateById(id, { name, email });
};


const deleteById = async (id) => {
  debugLog(`Deleting user with id ${id}`);
  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw new Error(`No user with id ${id} exists`, { id });
  }
};

module.exports = {
  register,
  getAll,
  getById,
  updateById,
  deleteById,
};