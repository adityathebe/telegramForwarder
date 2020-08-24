const database = require('../db/database');

const removeRedirection = async (sender, redirectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Redirection does not exist');

      ////////////////////////
      // Update to database //
      ////////////////////////
      const dbResponse = await database.removeRedirection(redirectionId);
      await database.changeUserQuota(sender, -1);
      return resolve({ dbResponse });
    } catch (err) {
      console.log(`[Error removeRedirection.js] :: ${err}`);
      return reject(err);
    }
  })
}

module.exports = removeRedirection;
