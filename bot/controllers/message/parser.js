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
  if (msgArr.length !== 3) return commandError(msgArr[0], 'Should contain 2 parameters');
  return {
    source: msgArr[1],
    destination: msgArr[2]
  }
}

const parseCommandRemove = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 2) return commandError(msgArr[0], 'Should contain 1 parameter <redirection id>');
  return { redirectionId: msgArr[1] }
}

const parseCommandList = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 1) return commandError(msgArr[0], 'Should not have any parameter');
  return true;
}

const parseCommandActivate = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 2) return commandError(msgArr[0], 'Should contain 1 parameter <redirection id>');
  return { redirectionId: msgArr[1] }
}

const parseCommandDeactivate = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 2) return commandError(msgArr[0], 'Should contain 1 parameter <redirection id>');
  return { redirectionId: msgArr[1] }
}

const parseCommandFilter = (message) => {
  /*
   Should take 3 or more parameters depending on the filter
   /filter stickers 12345 on
  */

  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 4) return commandError(msgArr[0], 'Should contain at least 4 parameters');

  const validFilters = ['photos', 'videos', 'audio', 'stickers', 'contains', 'notcontains']

  const filterName = msgArr[1];
  const refirectionId = msgArr[2];
  const filterState = msgArr[3];

  // Should be valid filter
  if (validFilters.indexOf(filterName) < 0) return commandError(msgArr[0], 'Invalid Filter Name');



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