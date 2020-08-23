const request = require('request');
const AGENT_URL = require('../config/index').AGENT.url;

const _sendRequest = (endpoint) => {
  return new Promise((resolve, reject) => {
    request(AGENT_URL + endpoint, { json: true }, (err, resp, body) => {
      if (err) return reject(err);
      return resolve(body);
    });
  });
};

class ForwardAgent {
  static async joinPublicUserEntity(entityName) {
    const endpoint = `joinPublicUserEntity?entity=${entityName}`;
    try {
      const resp = await _sendRequest(endpoint);
      return resp;
    } catch (err) {
      return err;
    }
  }

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
  static getEntity(entity, option = { is_id: false }) {
    return new Promise(async (resolve, reject) => {
      try {
        let endpoint = `getentity?entity=${entity}`;
        if (option.is_id) {
          endpoint += `&is_id=1`;
        }
        const resp = await _sendRequest(endpoint);

        if (resp._ === 'User') {
          return resolve({
            joined: false,
            entity: {
              type: 'user',
              chatId: resp.id,
              title: resp.username || resp.first_name || resp.last_name,
              accessHash: resp.access_hash,
              bot: resp.bot,
            },
          });
        } else if (resp._ === 'Channel') {
          return resolve({
            joined: !resp.left,
            entity: {
              type: 'channel',
              chatId: resp.id,
              title: resp.title || resp.username,
              accessHash: resp.access_hash,
              megagroup: resp.megagroup,
              adminRights: resp.admin_rights,
            },
          });
        } else if (resp._ === 'Chat') {
          if (resp.kicked) {
            throw new Error(`Bot was kicked from ${resp.title}`);
          }

          return resolve({
            joined: !resp.left,
            entity: {
              type: 'group',
              chatId: resp.id,
              title: resp.title,
              accessHash: resp.id,
            },
          });
        } else if (
          resp.error ===
          'Cannot get entity from a channel (or group) that you are not part of. Join the group and retry'
        ) {
          return resolve({
            joined: false,
            entity: null,
          });
        } else {
          throw new Error(resp.error);
        }
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = ForwardAgent;

if (require.main === module) {
  ForwardAgent.getEntity('1256091383', { is_id: true })
    .then((x) => console.log(x))
    .catch((x) => console.log(x));
}
