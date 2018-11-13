const database = require('../db/database');

const getTransformations = (sender, redirectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      // Linked with the given transformations   //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Filter does not exist');

      /////////////////////////
      // Get transformations //
      /////////////////////////
      const transformations = await database.getTransformationsOfRedirection(redirectionId);
      if (transformations.length === 0) throw new Error('You have no transformations');

      return resolve(transformations);
    } catch (err) {
      console.log(`[ERROR getTransformations.js] : ${err}`);
      return reject(err);
    }
  });
};

module.exports = getTransformations;
