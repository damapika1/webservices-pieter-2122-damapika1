const config = require('config');

const {
  getChildLogger,
} = require('../core/logging');
const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const DEFAULT_PAGINATION_LIMIT = config.get('pagination.limit');
const DEFAULT_PAGINATION_OFFSET = config.get('pagination.offset');
const {
  hashPassword,
  verifyPassword,
} = require('../core/password');
const Roles = require('../core/roles');
const {
  generateJWT,
  verifyJWT,
} = require('../core/jwt');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('user-service');
  this.logger.debug(message, meta);
};

const makeExposedUser = ({
  //password_hash,
  ...user
}) => user;
const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    token,
    user: makeExposedUser(user),
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }
  const passwordValid = await verifyPassword(password, user.password_hash);
  if (!passwordValid) {
    throw ServiceError.unauthorized('The given email and password do not match');
  }
  return makeLoginData(user);
};

const register = async ({
  name,
  email,
  password,
}) => {
  debugLog('Creating a new user', {
    name,
  });
  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    roles: [Roles.USER],
  });
  return await makeLoginData(user);
};


const getAll = async (
  limit = DEFAULT_PAGINATION_LIMIT,
  offset = DEFAULT_PAGINATION_OFFSET,
) => {
  debugLog('Fetching all users', {
    limit,
    offset,
  });
  const data = await userRepository.findAll({
    limit,
    offset,
  });
  const count = await userRepository.findCount();
  if (count === 0) {
    throw ServiceError.notFound('There is no users!', {
      count,
    });
  }
  return {
    data: data.map(makeExposedUser),
    count,
    limit,
    offset,
  };
};

const getById = async (id) => {
  debugLog(`Fetching user with id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id,
    });
  }

  return makeExposedUser(user);
};

const updateById = async (id, {
  name,
  email,
}) => {
  debugLog(`Updating user with id ${id}`, {
    name,
    email,
  });
  const user = await userRepository.updateById(id, {
    name,
    email,
  });
  return makeExposedUser(user);
};


const deleteById = async (id) => {
  debugLog(`Deleting user with id ${id}`);
  const deleted = await userRepository.deleteById(id);

  if (!deleted) {
    throw ServiceError.notFound(`No user with id ${id} exists`, {
      id,
    });
  }
};
const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substr(7);
  try {
    const {
      roles,
      userId,
    } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('user-service');
    logger.error(error.message, {
      error,
    });
    throw ServiceError.unauthorized(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};

module.exports = {
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  checkAndParseSession,
  checkRole,
};