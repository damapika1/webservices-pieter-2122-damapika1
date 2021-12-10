module.exports = {
  log: {
    level: "silly",
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:3000'],//* voor alles
    maxAge: 3 * 60 * 60,

  }
};