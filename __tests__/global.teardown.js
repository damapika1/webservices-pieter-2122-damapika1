const {
  shutdownData,
  getKnex,
  tables,
} = require('../src/data');

module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.comment).delete();
  await getKnex()(tables.pin).delete();
  await getKnex()(tables.user).delete();

  // Close database connection
  await shutdownData();
};