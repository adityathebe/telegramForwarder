const database = require('../db/database');
const ForwardAgent = require('../services/agent');
const QUOTA_LIMIT = require('../config/misc').quotaLimitFreeUser;

/**
 * Activates a redirection
 * @param {String} sender Chat id of the owner
 * @param {String} filterData.redirectionId Redirection Id
 * @param {String} filterData.name Filter name
 * @param {String} filterData.state Filter state
 * @param {Array} filterData.keywords Keywords if filter is contain or notcontain
 */
const addFilter = (sender, filterData) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == filterData.redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Redirection doesnot exist');

      ////////////////////////////////////////////
      // If Filtername is contain or notcontain //
      ////////////////////////////////////////////
      if (filterData.keywords) {
        const keywords = filterData.keywords.join('<stop_word>');
        const dbResponse = await database.saveFilter(filterData.redirectionId, filterData.name, keywords);
        return resolve({ filterData, dbResponse });
      } else {
        const filterState = filterData.state === 'on' ? 1 : 0;
        const dbResponse = await database.saveFilter(filterData.redirectionId, filterData.name, filterState);
        return resolve({ filterData, dbResponse });
      }
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = addFilter;

if (require.main === module) {
  addFilter('451722605', {
    redirectionId: 41,
    state: 'on',
    keywords: ['hi', 'there', 'how are you ?'],
    name: 'contain'
  })
    .then(x => console.log(x))
    .catch(x => console.log(x))
}