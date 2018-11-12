const database = require('../db/database');
const ForwardAgent = require('../services/agent');

const addTransformation = (sender, redirectionId, oldPhrase, newPharse) => {
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
      const dbResponse = await database.saveTransformation(redirectionId, oldPhrase, newPharse);
      return resolve({ redirectionId, transformationId: dbResponse.insertId });
    } catch (err) {
      console.log(`ERROR: [addRedirection()] ${err}`)
      reject(err);
    }
  });
};

module.exports = addTransformation;
