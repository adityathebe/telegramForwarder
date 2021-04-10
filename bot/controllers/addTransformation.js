const pino = require('pino');

const database = require('../db/database');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const addTransformation = async (sender, redirectionId, oldPhrase, newPhrase) => {
  /////////////////////////////////////////////
  // Sender must be the owner of redirection //
  /////////////////////////////////////////////
  const redirections = await database.getRedirections(sender);
  let redirectionOfInterest = redirections.filter(redirection => redirection.id == redirectionId);
  if (redirectionOfInterest.length === 0) throw Error('Redirection does not exist');

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
  console.log({ redirectionId, oldPhrase, newPhrase, rankOfNewTransformation, sender });
  const dbResponse = await database.saveTransformation(redirectionId, oldPhrase, newPhrase, rankOfNewTransformation);
  return { redirectionId, transformationId: dbResponse.rows[0].id };
};

module.exports = addTransformation;
