const database = require('../db/database');

/**
 * Activates a redirection
 * @param {String} sender Chat id of the owner
 * @param {String} redirectionId Redirection Id
 */
const deactivateRedirection = (sender, redirectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Redirection doesnot exist');

      ////////////////////////
      // Update to database //
      ////////////////////////
      const dbResponse = await database.deactivateRedirection(redirectionId);
      return resolve({ redirection: redirectionOfInterest[0], dbResponse });
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = deactivateRedirection;

if (require.main === module) {
  deactivateRedirection('451722605', '39')
    .then(x => console.log(x))
    .catch(x => console.log(x))
}