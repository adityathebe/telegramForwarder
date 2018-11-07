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


/**
 * Adds a redirection
 * @param {String} sender Chat id of the owner
 * @param {String} source Username / Link of Source
 * @param {String} destination Username / Link of Destination
 */
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
      // Get Entities                      //
      // If not joinable, will throw Error //
      ///////////////////////////////////////
      let sourceEntity = await ForwardAgent.getEntity(source);
      let destinationEntity = await ForwardAgent.getEntity(destination);

      //////////////////////////
      // Join agent to source //
      //////////////////////////
      let joinSrcRequestResponse = null;
      if (sourceType.username) {

        // If user or bot throw error
        if (sourceEntity.entity) {
          if (sourceEntity.entity.type === 'user') {
            throw new Error('Cannot redirect to or from bot/user');
          }
        }

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

        // If user or bot throw error
        if (sourceEntity.entity) {
          if (sourceEntity.entity.type === 'user') {
            throw new Error('Cannot redirect to or from bot/user');
          }
        }

        joinDestRequestResponse = await ForwardAgent.joinPublicEntity(destinationType.username);
      } else if (destinationType.hash) {
        joinDestRequestResponse = await ForwardAgent.joinPrivateEntity(destinationType.hash);
      }
      if (joinDestRequestResponse.error) return reject(joinDestRequestResponse.error);

      /////////////////////////////////////////////////////////////////
      // We cannot get entity from an invitation link before joining //
      // Now that we have joined, we can get the entity              //
      /////////////////////////////////////////////////////////////////
      if (sourceEntity.entity === null) {
        sourceEntity = await ForwardAgent.getEntity(source);
      }
      if (destinationEntity.entity === null) {
        destinationEntity = await ForwardAgent.getEntity(destination);
      }

      //////////////////////////
      // No Duplicate Entries //
      // No Circular Entries  //
      //////////////////////////
      const allRedirections = await database.getRedirections(sender);
      for (const redirection of allRedirections) {
        const source = redirection.source;
        const destination = redirection.destination;

        if (source == sourceEntity.entity.chatId && destination == destinationEntity.entity.chatId) {
          throw new Error(`Redirection already exists with id \`[${redirection.id}]\`. `)
        }

        if (source == destinationEntity.entity.chatId && destination == sourceEntity.entity.chatId ) {
          throw new Error(`Circular redirection is not allowed \`[${redirection.id}]\`. `)
        }
      }

      ///////////////////////
      // Store to database //
      ///////////////////////
      const srcId = sourceEntity.entity.chatId;
      const destId = destinationEntity.entity.chatId;
      const srcTitle = sourceEntity.entity.title;
      const destTitle = destinationEntity.entity.title;
      const dbResponse = await database.saveRedirection(sender, srcId, destId, srcTitle, destTitle);

      return resolve({ sourceEntity, destinationEntity, dbResponse });
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = addRedirection;

if (require.main === module) {
  addRedirection('451722605', 'https://t.me/joinchat/AAAAAEe7gLe3EYu3D_t0Yg', 'https://t.me/joinchat/AAAAAEv7_vtg3hq24P4yfA')
    .then(x => console.log(x))
    .catch(x => console.log(x))
}