module.exports = {
  LOG: {
    LOG_LEVEL: "silly",
    LOG_DISABLED: false,
  },
  cors: {
    origins: ['http://localhost:3000'],//* voor alles
    maxAge: 3 * 60 * 60,

  }
};