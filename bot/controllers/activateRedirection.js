const database = require('../db/database');
const ForwardAgent = require('../services/agent');
const QUOTA_LIMIT = require('../config/misc').quotaLimitFreeUser;

/**
 * Activates a redirection
 * @param {String} sender Chat id of the owner
 * @param {String} redirectionId Redirection Id
 */
const activateRedirection = (sender, redirectionId) => {

  return new Promise(async (resolve, reject) => {

    try {

      /////////////////////////////////////////////
      // Sender must be the owner of redirection //
      /////////////////////////////////////////////
      const redirections = await database.getRedirections(sender);
      let redirectionOfInterest = redirections.filter((redirection) => redirection.id == redirectionId)
      if (redirectionOfInterest.length === 0) throw Error('Redirection doesnot exist');

      /////////////////////////////////////////////
      // If destination is Channel or Supergroup //
      // Should have admin rights                //
      /////////////////////////////////////////////
      const destId = redirectionOfInterest[0].destination;
      const entity = await ForwardAgent.getEntity(destId, { is_id : true });
      if (entity.entity.type === 'channel' && entity.entity.megagroup === false) {
        if (!entity.entity.adminRights) {
          throw Error(`Please provide admin rights to @SynapticSupport on ${redirectionOfInterest[0].destination_title}`);
        }
      }

      ////////////////////////
      // Update to database //
      ////////////////////////
      const dbResponse = await database.activateRedirection(redirectionId);
      return resolve({ redirection: redirectionOfInterest[0], dbResponse });
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = activateRedirection;

if (require.main === module) {
  activateRedirection('451722605', '30')
    .then(x => console.log(x))
    .catch(x => console.log(x))
}