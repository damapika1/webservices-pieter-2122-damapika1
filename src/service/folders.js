const uuid = require('uuid');
const {
  getChildLogger
} = require('../core/logging');
const foldersRepository = require('../repository/folders');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getChildLogger('note-service');
  this.logger.debug(message, meta);
}