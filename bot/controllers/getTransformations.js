const database = require('../db/database');

const getTransformations = async (sender, redirectionId) => {
  /////////////////////////////////////////////
  // Sender must be the owner of redirection //
  // Linked with the given transformations   //
  /////////////////////////////////////////////
  const redirections = await database.getRedirections(sender);
  const redirectionOfInterest = redirections.filter(redirection => redirection.id == redirectionId);
  if (redirectionOfInterest.length === 0) throw Error('Redirection does not exist');

  /////////////////////////
  // Get transformations //
  /////////////////////////
  return await database.getTransformationsOfRedirection(redirectionId);
};

module.exports = getTransformations;
