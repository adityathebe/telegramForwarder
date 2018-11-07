const request = require('request')
const AGENT_URL = require('../config/agent').url;

const _sendRequest = (endpoint) => {
  return new Promise((resolve, reject) => {
    request(AGENT_URL + endpoint, { json: true }, (err, resp, body) => {
      if (err) return reject(err);
      return resolve(body);
    })
  })
}

class ForwardAgent {

  static async joinPublicEntity(entityName) {
    const endpoint = `joinPublicEntity?entity=${entityName}`;
    try {
      const resp = await _sendRequest(endpoint);
      return resp;
    } catch (err) {
      return err;
    }
  }

  static async joinPrivateEntity(hash) {
    const endpoint = `joinPrivateEntity?hash=${hash}`;
    try {
      const resp = await _sendRequest(endpoint);
      return resp;
    } catch (err) {
      return err;
    }
  }

  /**
   * Calls Agent to get the detail of the entity
   * @param {String} entity
   * @returns {Promise} Returns a promise of object 
   */
  static getEntity(entity) {
    return new Promise(async(resolve, reject) => {
      try {
        const endpoint = `getentity?entity=${entity}`;
        const resp = await _sendRequest(endpoint);

        if (resp._ === 'User') {
          return resolve({
            joinable: true,
            chatId: resp.id,
            title: resp.username || resp.first_name || resp.last_name,
            accessHash: resp.access_hash,
            bot: resp.bot,
          })
        }

        else if (resp._ === 'Channel') {
          return resolve({
            joinable: true,
            chatId: resp.id,
            title: resp.title || resp.username,
            accessHash: resp.access_hash,
            megagroup: resp.bot,
            left: resp.left,
          })
        }

        else if (resp.error === 'Cannot get entity from a channel (or group) that you are not part of. Join the group and retry') {
          return resolve({
            joinable: true,
          })
        }
        
        else {
          throw resp.error;
        }

      } catch (err) {
        return reject(new Error(err));
      }
    });
  }

}

module.exports = ForwardAgent;
