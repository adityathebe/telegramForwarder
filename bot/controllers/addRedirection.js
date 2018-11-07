const database = require('../db/database');
const ForwardAgent = require('../services/agent');

/**
 * Verifies that the source/destination is in one of the two valid formats
 * -- If it's a public entity (username), it should start with "@"
 * -- If it's a private entity (invitation link), it should start with t.me/joinchat/<HASH>
 * @param {string} entity username or invitation link
 * @returns {Object}
 */
const checkSourcePattern = (entity) => {
  if (entity.indexOf('@') === 0) return { username: entity };
  if (entity.indexOf('t.me/joinchat/') === 0) return { hash: entity.replace('t.me/joinchat/', '') };
  if (entity.indexOf('https://t.me/joinchat/') === 0) return { hash: entity.replace('https://t.me/joinchat/', '') };
  return { error: 'Invalid format' };
}

const addRedirection = (sender, source, destination) => {

  return new Promise(async (resolve, reject) => {

    try {

      // Get Source type
      const sourceType = checkSourcePattern(source);
      if (sourceType.error) return reject(sourceType.error);
      
      // Get Destination type
      const destinationType = checkSourcePattern(destination);
      if (destinationType.error) return reject(destinationType.error);

      // Get Entities
      const sourceEntity = await ForwardAgent.getEntity(source);
      const destinationEntity = await ForwardAgent.getEntity(destination);

      // Join agent to source
      let joinSrcRequestResponse = null;
      if (sourceType.username) {
        joinSrcRequestResponse = await ForwardAgent.joinPublicEntity(sourceType.username);
      } else if (sourceType.hash) {
        joinSrcRequestResponse = await ForwardAgent.joinPrivateEntity(sourceType.hash);
      }
      if (joinSrcRequestResponse.error) return reject(joinSrcRequestResponse.error);

      // Join agent to destination
      let joinDestRequestResponse = null;
      if (destinationType.username) {
        joinDestRequestResponse = await ForwardAgent.joinPublicEntity(destinationType.username);
      } else if (destinationType.hash) {
        joinDestRequestResponse = await ForwardAgent.joinPrivateEntity(destinationType.hash);
      }
      if (joinDestRequestResponse.error) return reject(joinDestRequestResponse.error);

      // Store to database
      const dbResponse = await database.saveRedirection(sender, source, destination);

      return resolve({ joinSrcRequestResponse, joinDestRequestResponse, dbResponse });
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = addRedirection;
