const bot = require('../../app');
const db = require('../../db/database');
const MessageParser = require('./parser');

// Controllers
const addFilter = require('../addFilter');
const getFilter = require('../getFilter');
const addRedirection = require('../addRedirection');
const addTransformation = require('../addTransformation');
const swapTransformationRank = require('../swapTransformationRank');
const removeRedirection = require('../removeRedirection');
const activateRedirection = require('../activateRedirection');
const deactivateRedirection = require('../deactivateRedirection');

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
  if (!isValidCommand) {
    const reply = '❌ Command does not exist.\n\nType /help';
    return bot.send_message(sender, reply).catch(err => console.log(err));
  }

  const command = MessageParser.getCommand(message);
  const parser = MessageParser.hashMap()[command];
  const parsedMsg = parser(message);

  if (parsedMsg.error) {
    const reply = `❌ Error in command : ${parsedMsg.command}\n\n**${parsedMsg.error}**`;
    return bot.send_message(sender, reply, 'markdown').catch(err => console.log(err));
  }

  if (command === '/add') {
    try {
      const addRedirectionResponse = await addRedirection(sender, parsedMsg.source, parsedMsg.destination);
      const reply = `New Redirection added with <code>[${addRedirectionResponse.dbResponse.insertId}]</code>`;
      bot.send_message(sender, reply).catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

  else if (command === '/remove') {
    try {
      const removeRedirectionResponse = await removeRedirection(sender, parsedMsg.redirectionId);
      const reply = `Redirection removed <code>[${parsedMsg.redirectionId}]</code>`;
      bot.send_message(sender, reply).catch(err => console.log(err));
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

  else if (command === '/deactivate') {
    try {
      await deactivateRedirection(sender, parsedMsg.redirectionId)
      const reply = `Redirection deactivated <code>[${parsedMsg.redirectionId}]</code>`;
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

  else if (command === '/filter') {
    try {
      const response = await addFilter(sender, parsedMsg);
      let reply = `✅ Command Success.\n\n<code>`;
      reply += `- Redirection id : [${response.filterData.redirectionId}]\n`;
      reply += `- Filter Name : ${response.filterData.name}\n`;
      reply += `- Filter State : ${response.filterData.state}</code>`;
      bot.send_message(sender, reply).catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

  else if (command === '/filters') {
    try {
      const filter = await getFilter(sender, parsedMsg.filterId);
      let reply = `✅ Filters for redirection <code>[${filter.id}]</code>\n\n`;
      reply += '<code>'
      reply += `- ${filter.audio === 1 ? '🔵' : '🔴'} audio\n`
      reply += `- ${filter.video === 1 ? '🔵' : '🔴'} video\n`
      reply += `- ${filter.photo === 1 ? '🔵' : '🔴'} photo\n`
      reply += `- ${filter.sticker === 1 ? '🔵' : '🔴'} sticker\n`
      reply += `- ${filter.document === 1 ? '🔵' : '🔴'} document\n`
      reply += `- ${filter.geo === 1 ? '🔵' : '🔴'} geo\n`
      reply += `- ${filter.document === 1 ? '🔵' : '🔴'} contact\n`
      reply += `- ${filter.contain ? '🔵' : '🔴'} contain = ${filter.contain ? filter.contain.replace(/<stop_word>/g, ', ') : null}\n`;
      reply += `- ${filter.notcontain ? '🔵' : '🔴'} notcontain = ${filter.notcontain ? filter.notcontain.replace('<stop_word>', ', ') : null}`;
      reply += '</code>'
      bot.send_message(sender, reply).catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

  else if (command === '/transform') {
    try {
      const response = await addTransformation(sender, parsedMsg.redirectionId, parsedMsg.oldPhrase, parsedMsg.newPhrase);
      const reply = `New transformation added with id <code>${response.transformationId}</code>`
      bot.send_message(sender, reply).catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

  else if (command === '/transform-rank') {
    try {
      await swapTransformationRank(sender, parsedMsg.redirectionId, parsedMsg.rank1, parsedMsg.rank2);
      let reply = `Transformation rank swapped for redirection id \`${parsedMsg.redirectionId}\`\n\n`;
      reply += `\`${parsedMsg.rank1} <==> ${parsedMsg.rank2}\``;
      bot.send_message(sender, reply, 'markdown').catch(err => console.log(err));
    } catch (err) {
      const reply = err.message || err || 'Some error occured';
      bot.send_message(sender, reply).catch(err => console.log(err));
    }
  }

}

module.exports = handlePrivateMessage;