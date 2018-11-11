const database = require('../db/database');

/**
 * @param {String} sender Sender Chat id
 * @param {String} filterId Filter Id
 * @returns {Object}
 */
const getFilter = (sender, filterId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      // Linked with the given filter            //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == filterId)
      if (redirectionOfInterest.length === 0) throw Error('Filter does not exist');

      /////////////////
      // Get Filters //
      /////////////////
      const filters = await database.getFilter(filterId);
      if (filters.length === 0) throw new Error('You have no filters');

      return resolve(filters[0])
    } catch (err) {
      console.log(`[ERROR getFilters.js] : ${err}`)
      return reject(err);
    }
  })
}

module.exports = getFilter;

if (require.main === module) {
  getFilter('451722605', 41)
    .then(x => console.log(x))
    .catch(e => console.log(e))
}