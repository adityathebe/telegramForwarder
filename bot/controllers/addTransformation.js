const database = require('../db/database');

const addTransformation = (sender, redirectionId, oldPhrase, newPhrase) => {
  return new Promise(async (resolve, reject) => {
    try {
      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Redirection doesnot exist');

      /////////////////////////////////////////////////
      // Fetch Transformations for given redirection //
      // To determine the rank of transformation     //
      /////////////////////////////////////////////////
      const transformations = await database.getTransformationsOfRedirection(redirectionId);
      const currentHighestRank = transformations.reduce((prevVal, curVal, curIndex) => {
        return curVal.rank > prevVal ? curVal.rank : prevVal;
      }, -1);
      const rankOfNewTransformation = currentHighestRank + 1;

      /////////////////////
      // Update database //
      /////////////////////
      const dbResponse = await database.saveTransformation(redirectionId, oldPhrase, newPhrase, rankOfNewTransformation);
      return resolve({ redirectionId, transformationId: dbResponse.insertId });
    } catch (err) {
      console.log(`ERROR: [addTransformation()] ${err}`)
      reject(err);
    }
  });
};

module.exports = addTransformation;
