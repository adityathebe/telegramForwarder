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

      /////////////////////////////////////////////////
      // Validate and get Source && Destination type // 
      /////////////////////////////////////////////////
      const sourceType = checkSourcePattern(source);
      if (sourceType.error) return reject(sourceType.error);
      const destinationType = checkSourcePattern(destination);
      if (destinationType.error) return reject(destinationType.error);

      ///////////////////////////////////////
      // Get Entities ///////////////////////
      // If not joinable, will throw Error //
      ///////////////////////////////////////

      let sourceEntity = await ForwardAgent.getEntity(source);
      let destinationEntity = await ForwardAgent.getEntity(destination);

      //////////////////////////
      // Join agent to source //
      //////////////////////////

      let joinSrcRequestResponse = null;
      if (sourceType.username) {
        joinSrcRequestResponse = await ForwardAgent.joinPublicEntity(sourceType.username);
      } else if (sourceType.hash) {
        joinSrcRequestResponse = await ForwardAgent.joinPrivateEntity(sourceType.hash);
      }
      if (joinSrcRequestResponse.error) return reject(joinSrcRequestResponse.error);

      ///////////////////////////////
      // Join agent to destination //
      ///////////////////////////////

      let joinDestRequestResponse = null;
      if (destinationType.username) {
        joinDestRequestResponse = await ForwardAgent.joinPublicEntity(destinationType.username);
      } else if (destinationType.hash) {
        joinDestRequestResponse = await ForwardAgent.joinPrivateEntity(destinationType.hash);
      }
      if (joinDestRequestResponse.error) return reject(joinDestRequestResponse.error);

      /////////////////////////////////////////////////////////////////
      // We cannot get entity from an invitation link before joining //
      // Now that we have joined, we can get the entity ///////////////
      /////////////////////////////////////////////////////////////////
      
      if (sourceEntity.entity === null) {
        sourceEntity = await ForwardAgent.getEntity(source);
      }
      if (destinationEntity.entity === null) {
        destinationEntity = await ForwardAgent.getEntity(destination);
      }

      //////////////////////////
      // No duplicate entries //
      //////////////////////////

      


      ///////////////////////
      // Store to database //
      ///////////////////////
      const dbResponse = await database.saveRedirection(sender, sourceEntity.entity.chatId, destinationEntity.entity.chatId);

      return resolve({ sourceEntity, destinationEntity, dbResponse });
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = addRedirection;

if (require.main === module) {
  addRedirection('451722605', '@gexChannel', '@gexReceiver')
    .then(x => console.log(x))
    .catch(x => console.log(x))
}