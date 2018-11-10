const bot = require('../../app');
const db = require('../../db/database');
const MessageParser = require('./parser');

// Controllers
const addRedirection = require('../addRedirection');
const activateRedirection = require('../activateRedirection');
const removeRedirection = require('../removeRedirection');

const handlePrivateMessage = async (sender, messageEvent) => {

  const username = messageEvent.from.username;
  const message = messageEvent.text;
  const forwarded = messageEvent.forward_from_chat;

  console.log(`\nPRIVATE MESSAGE: ${username} - ${message}`);

  if (message === '/start') {
    let reply = 'Welcome to MultiFeed Bot! 🔥\n\n';
    reply += 'Send /help to get usage instructions';
    bot.send_message(sender, reply).catch(err => console.log(err));

    // Store User to Database
    return db.saveUser(sender, username, Math.random() * 1000);
  }

  if (message === '/help') {
    let reply = 'Typical workflow in the bot:\n\n';
    reply += '1. You have two links:\n';
    reply += '- `SOURCE` - link to the channel to forward messages FROM(no admin permissions required)\n';
    reply += '- `DESTINATION` - link to the channel to forward messages TO(you can add new admins there)\n\n';
    reply += '2. You use `/add` command to create a new redirection from `SOURCE` channel to your `DESTINATION` channel\n\n';
    reply += '3. You give posting permissions in `DESTINATION` channel TO THE ACCOUNT that was specified after successful execution of step #2\n\n';
    reply += '4. You activate the newly created redirection using `/activate` command\n\n';
    reply += 'Having all 4 steps completed, you can enjoy automatic messages forwarding from `SOURCE` to `DESTINATION` 🔥';
    return bot.send_message(sender, reply, 'markdown').catch(err => console.log(err));
  }

  // Check Commands with MessageParser
  const isValidCommand = MessageParser.isValidCommand(message);
  if (!isValidCommand) return console.log('[private.js] Invalid Command');

  const command = MessageParser.getCommand(message);
  const parser = MessageParser.hashMap()[command];
  const parsedMsg = parser(message);

  if (parsedMsg.error) {
    const reply = `Error in command : ${parsedMsg.command}\n\n**${parsedMsg.error}**`;
    return bot.send_message(sender, reply, 'markdown').catch(err => console.log(err));
  }

  if (command === '/add') {
    try {
      const addRedirectionResponse = await addRedirection(sender, parsedMsg.source, parsedMsg.destination);
      const reply = `New Redirection added with id \`${addRedirectionResponse.dbResponse.insertId}\``;
      bot.send_message(sender, reply, 'markdown').catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply, 'html').catch(err => console.log(err));
    }
  }

  else if (command === '/remove') {
    try {
      const removeRedirectionResponse = await removeRedirection(sender, parsedMsg.redirectionId);
      bot.send_message(sender, `Redirection ID: ${removeRedirectionResponse.redirectionId}`).catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

  else if (command === '/activate') {
    try {
      await activateRedirection(sender, parsedMsg.redirectionId)
      const reply = `Redirection activated <code>[${parsedMsg.redirectionId}]</code>`;
      bot.send_message(sender, reply).catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

  else if (command === '/list') {
    try {
      const redirections = await db.getRedirections(sender);
      if (redirections.length === 0) {
        return bot.send_message(sender, 'You have no redirections').catch(err => console.log(err));
      }
      
      let reply = '';
      redirections.forEach((redirection) => {
        let state = redirection.active == 1 ? "🔵" : "🔴";
        reply += `--- ${state} <code>[${redirection.id}]</code> ${redirection.source_title} => ${redirection.destination_title}\n`;
      });
      bot.send_message(sender, reply).catch(err => console.log(err));
    
    } catch (err) {
      console.log(err);
      bot.send_message(sender, err);
    }
  }
}

module.exports = handlePrivateMessage;