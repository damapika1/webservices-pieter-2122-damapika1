const {
  shutdownData,
  getKnex,
  tables,
} = require('../src/data');

module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.note).delete();
  await getKnex()(tables.user).delete();
  //await getKnex()(tables.place).delete();

  // Close database connection
  await shutdownData();
};