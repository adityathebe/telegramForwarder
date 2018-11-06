const database = require('../db/database');
const ForwardAgent = require('../services/agent');

const addRedirection = (sender, source, destination) => {

  return new Promise(async (resolve, reject) => {

    try {
      // Join agent to source
      const joinRequestResponse = await ForwardAgent.joinChannel(source);
      if (joinRequestResponse.error) return reject(joinRequestResponse.error);

      // Check if destination is valid
      const entityResponse = await ForwardAgent.getEntity(destination);
      if (entityResponse.error) return reject(entityResponse.error);

      // Store to database
      const dbResponse = await database.saveRedirection(sender, source, destination);
    
      return resolve({ joinRequestResponse, entityResponse, dbResponse })
    } catch (err) {
      reject(err);
    }
  })
}

module.exports = addRedirection;
