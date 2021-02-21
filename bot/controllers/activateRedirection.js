const database = require('../db/database');
const ForwardAgent = require('../services/agent');
const { TG_BOT_USERNAME } = require('../config').TG;

/**
 * Activates a redirection
 * @param {String} sender Chat id of the owner
 * @param {String} redirectionId Redirection Id
 */
const activateRedirection = async (sender, redirectionId) => {
  /////////////////////////////////////////////
  // Sender must be the owner of redirection //
  /////////////////////////////////////////////
  const redirections = await database.getRedirections(sender);
  let redirectionOfInterest = redirections.filter(redirection => redirection.id == redirectionId);
  if (redirectionOfInterest.length === 0) {
    throw new Error('Redirection does not exist');
  }

  /////////////////////////////////////////////
  // If destination is Channel or Supergroup //
  // Should have admin rights                //
  /////////////////////////////////////////////
  const destId = redirectionOfInterest[0].destination;
  const entity = await ForwardAgent.getEntity(destId, { is_id: true });
  if (entity.entity.type === 'channel' && entity.entity.megagroup === false) {
    if (!entity.entity.adminRights) {
      const errMsg = `Please provide admin rights to ${TG_BOT_USERNAME} on ${redirectionOfInterest[0].destination_title}`;
      throw new Error(errMsg);
    }
  }

  ////////////////////////
  // Update to database //
  ////////////////////////
  await database.activateRedirection(redirectionId);
};

module.exports = activateRedirection;
