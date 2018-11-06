const bot = require('../../app');
const db = require('../../db/database');
const MessageParser = require('./parser');

// Controllers
const addRedirection = require('../addRedirection');
const removeRedirection = require('../removeRedirection');

const handlePrivateMessage = async (sender, messageEvent) => {

  const username = messageEvent.from.username;
  const message = messageEvent.text;
  const forwarded = messageEvent.forward_from_chat;

  console.log(`\nPRIVATE MESSAGE: ${username} - ${message}`);

  if (message === '/start') {
    let reply = 'Welcome to MultiFeed Bot! 🔥\n\n';
    reply += 'Send /help to get usage instructions';
    return bot.send_message(sender, reply).catch(err => console.log(err));
  }

  if (message === '/help') {
    let reply = 'Typical workflow in the bot:\n\n';
    reply += '1. You have two links:\n';
    reply += '- SOURCE - link to the channel to forward messages FROM(no admin permissions required)\n';
    reply += '- DESTINATION - link to the channel to forward messages TO(you can add new admins there)\n\n';
    reply += '2. You use /add command to create a new redirection from SOURCE channel to your DESTINATION channel\n\n';
    reply += '3. You give posting permissions in DESTINATION channel TO THE ACCOUNT that was specified after successful execution of step #2\n\n';
    reply += '4. You activate the newly created redirection using /activate command\n\n';
    reply += 'Having all 4 steps completed, you can enjoy automatic messages forwarding from SOURCE to DESTINATION 🔥';
    return bot.send_message(sender, reply).catch(err => console.log(err));
  }

  // Check Commands with MessageParser
  const isValidCommand = MessageParser.isValidCommand(message);
  if (!isValidCommand) return console.log('[private.js] Invalid Command');

  const command = MessageParser.getCommand(message);
  const parser = MessageParser.hashMap()[command];
  const response = parser(message);

  if (response.error) {
    const reply = `Error in command : ${response.command}\n\n**${response.error}**`;
    return bot.send_message(sender, reply, 'markdown')
  }

  if (command === '/add') {
    const addRedirectionResponse = await addRedirection(response.source, response.destination);
    bot.send_message(sender, `Source: ${response.source} && Destination: ${response.destination}`);
  }

  else if (command === '/remove') {
    const removeRedirectionResponse = await removeRedirection(sender, response.redirectionId);
    bot.send_message(sender, `Redirection ID: ${response.redirectionId}`);
  }
}

module.exports = handlePrivateMessage;