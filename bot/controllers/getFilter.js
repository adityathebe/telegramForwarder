const database = require('../db/database');

/**
 * @param {String} sender Sender Chat id
 * @param {String} filterId Filter Id
 * @typedef {Object} GetFilterResponse
 * @property {string} error - Error Message
 * @property {Object} filter - Filter Object
 * @returns {GetFilterResponse}
 */
const getFilter = async (sender, filterId) => {
  /////////////////////////////////////////////
  // Sender must be the owner of redirection //
  // Linked with the given filter            //
  /////////////////////////////////////////////
  const redirections = await database.getRedirections(sender);
  const redirectionOfInterest = redirections.filter(redirection => redirection.id == filterId);
  if (redirectionOfInterest.length === 0) return { error: '⚠ Filter does not exist' };

  ////////////////
  // Get Filter //
  ////////////////
  const filter = await database.getFilter(filterId);
  if (!filter) return { error: '⚠ You have no filters' };
  return { filter };
};

module.exports = getFilter;
