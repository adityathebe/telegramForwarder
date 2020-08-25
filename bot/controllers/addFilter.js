const database = require('../db/database');

/**
 * Activates a redirection
 * @param {String} sender Chat id of the owner
 * @param {String} filterData.redirectionId Redirection Id
 * @param {String} filterData.name Filter name
 * @param {String} filterData.state Filter state
 * @param {Array} filterData.keywords Keywords if filter is contain or notcontain
 * @typedef {Object} AddFilterResponse
 * @property {string} error - Error Message
 * @property {Object} filterData - Filter Object
 * @returns {AddFilterResponse}
 */
const addFilter = async (sender, filterData) => {
  /////////////////////////////////////////////
  // Sender must be the owner of redirection //
  /////////////////////////////////////////////
  const redirections = await database.getRedirections(sender);
  let redirectionOfInterest = redirections.filter(redirection => redirection.id == filterData.redirectionId);
  if (redirectionOfInterest.length === 0) return { error: '⚠ Redirection doesnot exist' };

  ////////////////////////////////////////////
  // If Filtername is contain or notcontain //
  ////////////////////////////////////////////
  if (filterData.name === 'contain' || filterData.name === 'notcontain') {
    const keywords = filterData.keywords ? filterData.keywords.join('<stop_word>') : null;
    await database.saveFilter(filterData.redirectionId, filterData.name, keywords);
    return { filterData };
  } else {
    const filterState = filterData.state === 'on' ? 1 : 0;
    await database.saveFilter(filterData.redirectionId, filterData.name, filterState);
    return { filterData };
  }
};

module.exports = addFilter;

if (require.main === module) {
  addFilter('451722605', {
    redirectionId: 41,
    state: 'on',
    keywords: ['hi', 'there', 'how are you ?'],
    name: 'contain',
  })
    .then(x => console.log(x))
    .catch(x => console.log(x));
}
