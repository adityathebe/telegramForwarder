const validCommands = [
  '/add',
  '/remove',
  '/list',
  '/activate',
  '/deactivate',
  '/help',
  '/ref',
  '/filters',
  '/filter',
  '/transform',
  '/start',
  '/transforms',
  '/transformrank',
  '/transformremove',
];

// Command Error Constructor Function
const commandError = (command, errorMsg) => {
  return {
    command,
    error: errorMsg,
  }
}

const addMessageEntities = (messageEvent) => {
  const entities = messageEvent.entities;
  let msgText = messageEvent.text;
  let addedOffset = 0;

  entities.forEach((entity) => {
    const entityType = entity.type;
    let offset = entity.offset + addedOffset;
    let length = offset + entity.length;

    if (entityType === 'pre') {
      msgText = msgText.slice(0, offset) + "```" + msgText.slice(offset);
      length += 3
      msgText = msgText.slice(0, length) + "```" + msgText.slice(length);
      addedOffset += 6
    }

    else if (entityType === 'bold') {
      msgText = msgText.slice(0, offset) + "**" + msgText.slice(offset);
      length += 2
      msgText = msgText.slice(0, length) + "**" + msgText.slice(length);
      addedOffset += 4
    }

    else if (entityType === 'italic') {
      msgText = msgText.slice(0, offset) + "__" + msgText.slice(offset);
      length += 2
      msgText = msgText.slice(0, length) + "__" + msgText.slice(length);
      addedOffset += 4
    }

    else if (entityType === 'code') {
      msgText = msgText.slice(0, offset) + "`" + msgText.slice(offset);
      length += 1
      msgText = msgText.slice(0, length) + "`" + msgText.slice(length);
      addedOffset += 2
    }
  });

  return msgText;
}

/////////////////////////////
// Transformations Command //
/////////////////////////////

// Remove Transformation
const parseCommandTransformRemove = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 2) {
    let errMsg = 'Should contain 1 parameter.\n\n';
    errMsg += '`/transformremove <redirection id>\n`';
    return commandError(msgArr[0], errMsg);
  }
  return {
    transformationId: msgArr[1],
  }
}

// List Transformations
const parseCommandTransforms = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 2) {
    let errMsg = 'Should contain 1 parameter.\n\n';
    errMsg += '`/transforms <redirection id>\n`';
    return commandError(msgArr[0], errMsg);
  }
  return {
    redirectionId: msgArr[1],
  }
}

// Add Transformation
const parseCommandTransform = (message, messageEvent) => {
  message = addMessageEntities(messageEvent);
  const msgArrOfLines = message.trim().split('\n');
  const msgArr = msgArrOfLines[0].trim().replace(/\n/g, '').split(' ');
  if (msgArrOfLines.length !== 3 || msgArr.length !== 2) {
    let errMsg = 'Should contain 3 parameters.\n\n';
    errMsg += '`/transform <redirection id>\n`';
    errMsg += '`<phrase to transform>\n<phrase to transform with>`\n\n';
    errMsg += 'Example: \n\n';
    errMsg += '`/transform 1\njustin bieber\nFreddie Mercury`';
    return commandError(msgArr[0], errMsg);
  }
  return {
    redirectionId: msgArr[1],
    oldPhrase: msgArrOfLines[1],
    newPhrase: msgArrOfLines[2],
  }
}

// Swap rank of transformations
const parseCommandTransformRank = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 4) {
    let errMsg = 'Should contain 3 parameters.\n\n';
    errMsg += '`/transformrank <redirection id> <rank1> <rank2>\n\n`';
    errMsg += 'Example: \n\n';
    errMsg += '`/transform 100 2 3`';
    return commandError(msgArr[0], errMsg);
  }

  return {
    redirectionId: msgArr[1],
    rank1: msgArr[2],
    rank2: msgArr[3],
  }
}

//////////////////////////
// Redirection commands //
//////////////////////////

// Add Redirection
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

// Remove Redirection
const parseCommandRemove = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter.\n\n';
  errMsg += '`/remove <redirection id>`';
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { redirectionId: msgArr[1] }
}

// List Redirections
const parseCommandList = (message) => {
  const msgArr = message.trim().split(' ');
  if (msgArr.length !== 1) return commandError(msgArr[0], 'Should not have any parameter');
  return true;
}

// Activate Redirection
const parseCommandActivate = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter\n\n'
  errMsg += '`/activate <redirection id>`';
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { redirectionId: msgArr[1] }
}

// Deactivate Redirection
const parseCommandDeactivate = (message) => {
  const msgArr = message.trim().split(' ');
  let errMsg = 'Should contain 1 parameter\n\n'
  errMsg += '`/deactivate <redirection id>`';
  if (msgArr.length !== 2) return commandError(msgArr[0], errMsg);
  return { redirectionId: msgArr[1] }
}

/////////////////////
// Filter Commands //
/////////////////////

// Add Filter
const parseCommandFilter = (message) => {

  let parsedResponse = {};
  const msgArr = message.trim().split(' ');
  if (msgArr.length < 4) {
    let reply = 'Should contain at least 3 parameters.\n\n';
    reply += '`/filter <filter name> <redirection id> <filter state>`\n\n';
    reply += 'Example : \n\n'
    reply += '`/filter photo 152 on`'
    return commandError(msgArr[0], reply);
  }

  const validFilters = ['photo', 'video', 'audio', 'sticker', 'document', 'hashtag', 'link', 'contain', 'notcontain']
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

// List Filters
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
      '/transform': parseCommandTransform,
      '/transforms': parseCommandTransforms,
      '/transformrank': parseCommandTransformRank,
      '/transformremove': parseCommandTransformRemove,
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