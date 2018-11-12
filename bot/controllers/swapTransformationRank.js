const database = require('../db/database');

const swapTransformationRank = (sender, redirectionId, rank1, rank2) => {
  return new Promise( async(resolve, reject) => {
    try {

      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Redirection doesnot exist');

      /////////////////////////////////////////////
      // Both transformation ranks should exists //
      /////////////////////////////////////////////
      const transformations = await database.getTransformationsOfRedirection(redirectionId);
      const requiredTransformations = transformations.filter((tranformation) => {
        return tranformation.rank == rank1 || tranformation.rank == rank2;
      });
      if (requiredTransformations.length !== 2) throw new Error('The transformation does not exist');

      ////////////////
      // Swap ranks //
      ////////////////
      await database.changeTransformationRank(requiredTransformations[0].id, requiredTransformations[1].rank);
      await database.changeTransformationRank(requiredTransformations[1].id, requiredTransformations[0].rank);

      return resolve({ redirectionId })

    } catch (err) {
      console.log(`ERROR: [swapTransformationRank()] ${err}`)
      reject(err);
    }
  })
}

module.exports = swapTransformationRank;
