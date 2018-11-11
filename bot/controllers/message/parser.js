const validCommands = ['/add', '/remove', '/list', '/activate', '/deactivate', '/help', '/ref', '/filters', '/filter'];

// Command Error Constructor Function
const commandError = (command, errorMsg) => {
  return {
    command,
    error: errorMsg,
  }
}

const parseCommandAdd = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 2 parameters.\n\n'
  errMsg += '`/add @youtube @google\n/add https://t.me/joinchat @facebook`';
  if (msgArr.length !== 3) return commandError(msgArr[0], errMsg);
  return {
    source: msgArr[1],
    destination: msgArr[2]
  }
}

const parseCommandRemove = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter.\n\n';
  errMsg += '`/remove <redirection id>`';
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { redirectionId: msgArr[1] }
}

const parseCommandList = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 1) return commandError(msgArr[0], 'Should not have any parameter');
  return true;
}

const parseCommandActivate = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter\n\n'
  errMsg += '`/activate <redirection id>`';
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { redirectionId: msgArr[1] }
}

const parseCommandDeactivate = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter\n\n'
  errMsg += '`/deactivate <redirection id>`';
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { redirectionId: msgArr[1] }
}

const parseCommandFilter = (message) => {

  let parsedResponse = {};
  const msgArr = message.trim().split(' ');
  if (msgArr.length < 4) return commandError(msgArr[0], 'Should contain at least 3 parameters');

  const validFilters = ['photo', 'video', 'audio', 'sticker', 'contain', 'notcontain']
  const validStates = ['on', 'off'];

  const filterName = msgArr[1];
  const redirectionId = msgArr[2];
  const filterState = msgArr[3].split(/\n/g)[0];

  ////////////////////
  // Valid filter ? //
  ////////////////////
  if (validFilters.indexOf(filterName) < 0) {
    const errMsg = `Invalid filter name. Available filters :\n\n- ${validFilters.join('\n- ')}`
    return commandError(msgArr[0], errMsg);
  }

  ///////////////////
  // Valid state ? //
  ///////////////////
  if (validStates.indexOf(filterState.toLowerCase()) < 0) {
    const errMsg = `Invalid State. Available states :\n\n- ${validStates.join('\n- ')}`;
    return commandError(msgArr[0], errMsg);
  }

  /////////////////////////////////////////////////////////////////
  // If filter name is contain or notcontain gather the keywords //
  // Keywords are only required if filterstate = 'on'            //
  /////////////////////////////////////////////////////////////////
  if (filterState === 'on') {
    if (filterName === 'contain' || filterName === 'notcontain') {
      const msgArrLine = message.trim().split('\n');
      const filterKeywords = msgArrLine.splice(1, msgArrLine.length).filter(x => x !== '');
      parsedResponse.keywords = filterKeywords;

      if (filterKeywords.length === 0) {
        let errMsg = 'Please provide keywords.\n\n Example: \n';
        errMsg += '`/filter contain 1 on\nqueen\nBohemian Rhapsody`'
        return commandError(msgArr[0], errMsg);
      }
    }
  }

  parsedResponse.name = filterName;
  parsedResponse.state = filterState;
  parsedResponse.redirectionId = redirectionId;
  return parsedResponse;
}

const parseCommandFilters = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter\n\n';
  errMsg += '`/filters <filter id>`'
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { filterId: msgArr[1] }
}


class MessageParser {

  /**
   * Takes in message and checks if there is a valid command
   * @param {String} message Telegram Message
   * @returns {Boolean}
   */
  static isValidCommand(message) {
    const firstWord = message.trim().split(' ')[0];
    return validCommands.indexOf(firstWord) >= 0;
  }

  static hashMap() {
    return {
      '/add': parseCommandAdd,
      '/remove': parseCommandRemove,
      '/list': parseCommandList,
      '/activate': parseCommandActivate,
      '/deactivate': parseCommandDeactivate,
      '/filter': parseCommandFilter,
      '/filters': parseCommandFilters,
    }
  }

  /**
   * Takes in message and returns command.
   * Should only be called after making sure there is a valid command using isValidCommand()
   * @param {String} message Telegram Message
   * @returns {String} returns command name
   */
  static getCommand(message) {
    return message.trim().split(' ')[0];
  }

}

module.exports = MessageParser;

if (require.main === module) {
  let message = '/list ';
  const isValid = MessageParser.isValidCommand(message);
  if (isValid) {
    const command = MessageParser.getCommand(message);
    const parser = hashMap[command];
    const response = parser(message);

    if (response.error) {
      return console.log(response)
    }

    if (command === '/add') {
      console.log(`Source: ${response.source} && Destination: ${response.destination}`)
    }

    else if (command === '/remove') {
      console.log(`Redirection ID: ${response.redirectionId}`)
    }
  }
}