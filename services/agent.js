const request = require('request')
const AGENT_URL = require('../config/agent').url;

class ForwardAgent {

  static _sendRequest() {
    request(AGENT_URL)
  }


}

module.export = ForwardAgent