// @ts-check
const pino = require('pino');
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events').EventEmitter;

const db = require('./db/database');
const bot = require('./services/telegram');
const MessageParser = require('./controllers/message/parser');

// Controllers
const addFilter = require('./controllers/addFilter');
const getFilter = require('./controllers/getFilter');
const addRedirection = require('./controllers/addRedirection');
const activateRedirection = require('./controllers/activateRedirection');
const removeRedirection = require('./controllers/removeRedirection');
const deactivateRedirection = require('./controllers/deactivateRedirection');
const addTransformation = require('./controllers/addTransformation');
// const swapTransformationRank = require('../swapTransformationRank');
const getTransformations = require('./controllers/getTransformations');
const removeTransformation = require('./controllers/removeTransformation');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
class CommandHandler extends EventEmitter {}
const commandHandler = new CommandHandler();

bot.onText(new RegExp('^/start$'), async msgEvent => {
  let reply = 'Welcome to MultiFeed Bot! 🔥\n\n';
  reply += 'Send /help to get usage instructions';
  bot.sendMessage(msgEvent.chat.id, reply).catch(logger.error);

  // Store User to Database
  try {
    await db.saveUser(msgEvent.chat.id, msgEvent.from.username, uuidv4());
  } catch (err) {
    logger.error(err);
  }
});

bot.onText(new RegExp('^/help$'), msgEvent => {
  let reply = 'Typical workflow in the bot:\n\n';
  reply += '1. You have two links:\n';
  reply += '- `SOURCE` - link to the channel to forward messages FROM';
  reply += '(no admin permissions required)\n';
  reply += '- `DESTINATION` - link to the channel to forward messages TO';
  reply += '(you can add new admins there)\n\n';
  reply += '2. You use `/add` command to create a new redirection from ';
  reply += '`SOURCE` channel to your `DESTINATION` channel\n\n';
  reply += '3. You give posting permissions in `DESTINATION` channel TO THE ';
  reply += 'ACCOUNT that was specified after successful execution of step #2';
  reply += '\n\n';
  reply += '4. You activate the newly created redirection using `/activate` ';
  reply += 'command\n\n';
  reply += 'Having all 4 steps completed, you can enjoy automatic messages ';
  reply += 'forwarding from `SOURCE` to `DESTINATION` 🔥';
  return bot
    .sendMessage(msgEvent.chat.id, reply, {
      parse_mode: 'Markdown',
    })
    .catch(console.error);
});

bot.on('message', msgEvent => {
  if (msgEvent.chat.type == 'private') {
    // Parse Command
    // Check Commands with MessageParser
    const isValidCommand = MessageParser.isValidCommand(msgEvent.text);
    if (!isValidCommand) {
      const reply = '❌ Command does not exist.\n\nType /help';
      return bot.sendMessage(msgEvent.chat.id, reply).catch(console.error);
    }

    const command = MessageParser.getCommand(msgEvent.text);

    // Commands that are handled elsewhere
    const reservedCommands = ['/help', '/start'];
    if (reservedCommands.includes(command)) return;

    const parser = MessageParser.hashMap()[command];
    const parsedMsg = parser(msgEvent.text, msgEvent);

    if (parsedMsg.error) {
      const reply = `❌ Error in command : ${parsedMsg.command}\n\n**${parsedMsg.error}**`;
      return bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'Markdown' }).catch(console.error);
    }

    commandHandler.emit(command, parsedMsg, msgEvent);
  }
});

commandHandler.on('/add', async (data, msgEvent) => {
  console.log('Adding redirection');
  try {
    const { error } = await addRedirection(msgEvent.chat.id, data.source, data.destination);
    if (error) {
      return bot
        .sendMessage(msgEvent.chat.id, error, {
          parse_mode: 'HTML',
        })
        .catch(e => console.error(e.message));
    }
    const reply = `✔ New Redirection added`;
    return bot.sendMessage(msgEvent.chat.id, reply, {
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error(err);
    const reply = err.message || err || 'Some error occured';
    bot
      .sendMessage(msgEvent.chat.id, '❌ ' + reply, {
        parse_mode: 'HTML',
      })
      .catch(console.error);
  }
});

commandHandler.on('/activate', async (data, msgEvent) => {
  console.log('Activating redirection');
  try {
    await activateRedirection(msgEvent.chat.id, data.redirectionId);
    const reply = `Redirection activated <code>[${data.redirectionId}]</code>`;
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  } catch (err) {
    const reply = err.message || err || 'Some error occured';
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  }
});

commandHandler.on('/list', async (data, msgEvent) => {
  try {
    const redirections = await db.getRedirections(msgEvent.chat.id);
    if (redirections.length === 0) {
      return bot
        .sendMessage(msgEvent.chat.id, 'You have no redirections', { parse_mode: 'HTML' })
        .catch(err => console.log(err));
    }

    let reply = '';
    redirections.forEach(redirection => {
      let state = redirection.active == 1 ? '🔵' : '🔴';
      reply += `--- ${state} <code>[${redirection.id}]</code> ${redirection.source_title} => ${redirection.destination_title}\n`;
    });
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(err => console.log(err));
  } catch (err) {
    console.log(err);
    bot.sendMessage(msgEvent.chat.id, err, { parse_mode: 'HTML' });
  }
});

commandHandler.on('/deactivate', async (data, msgEvent) => {
  try {
    await deactivateRedirection(msgEvent.chat.id, data.redirectionId);
    const reply = `Redirection deactivated <code>[${data.redirectionId}]</code>`;
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  } catch (err) {
    const reply = err.message || err || 'Some error occured';
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  }
});

commandHandler.on('/remove', async (data, msgEvent) => {
  try {
    await removeRedirection(msgEvent.chat.id, data.redirectionId);
    const reply = `Redirection removed <code>[${data.redirectionId}]</code>`;
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  } catch (err) {
    const reply = err.message || err || 'Some error occured';
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  }
});

commandHandler.on('/filter', async (data, msgEvent) => {
  try {
    const { error, filterData } = await addFilter(msgEvent.chat.id, data);
    if (error) {
      bot.sendMessage(msgEvent.chat.id, error).catch(logger.error);
      return;
    }
    let reply = `✅ Command Success.\n\n<code>`;
    reply += `- Redirection id : [${filterData.redirectionId}]\n`;
    reply += `- Filter Name : ${filterData.name}\n`;
    reply += `- Filter State : ${filterData.state}</code>`;
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  } catch (err) {
    const reply = err.message || err || 'Some error occured';
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(console.error);
  }
});

commandHandler.on('/filters', async (data, msgEvent) => {
  try {
    const { filter, error } = await getFilter(msgEvent.chat.id, data.filterId);
    if (error) {
      bot.sendMessage(msgEvent.chat.id, error, { parse_mode: 'HTML' }).catch(err => logger.error(err));
      return;
    }

    let reply = `✅ Filters for redirection <code>[${filter.id}]</code>\n\n`;
    reply += '<code>';
    reply += `- ${filter.audio ? '🔵' : '🔴'} audio\n`;
    reply += `- ${filter.video ? '🔵' : '🔴'} video\n`;
    reply += `- ${filter.photo ? '🔵' : '🔴'} photo\n`;
    reply += `- ${filter.sticker ? '🔵' : '🔴'} sticker\n`;
    reply += `- ${filter.document ? '🔵' : '🔴'} document\n`;
    reply += `- ${filter.hashtag ? '🔵' : '🔴'} hashtag\n`;
    reply += `- ${filter.link ? '🔵' : '🔴'} link\n`;
    reply += `- ${filter.contain ? '🔵' : '🔴'} contain = ${
      filter.contain ? filter.contain.replace(/<stop_word>/g, ', ') : null
    }\n`;
    reply += `- ${filter.notcontain ? '🔵' : '🔴'} notcontain = ${
      filter.notcontain ? filter.notcontain.replace('<stop_word>', ', ') : null
    }`;
    reply += '</code>';
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(err => logger.error(err));
  } catch (err) {
    logger.error(err);
    bot.sendMessage(msgEvent.chat.id, '❌ Some error occured').catch(err => logger.error(err));
  }
});

commandHandler.on('/transform', async (data, msgEvent) => {
  try {
    const response = await addTransformation(msgEvent.chat.id, data.redirectionId, data.oldPhrase, data.newPhrase);
    const reply = `New transformation added with id <code>${response.transformationId}</code>`;
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(err => logger.error(err));
  } catch (err) {
    logger.error(err);
    bot.sendMessage(msgEvent.chat.id, `❌ ${err}`).catch(err => logger.error(err));
  }
});

commandHandler.on('/transforms', async (data, msgEvent) => {
  try {
    const transformations = await getTransformations(msgEvent.chat.id, data.redirectionId);
    if (transformations.length == 0) {
      const reply = 'No transformation found.';
      bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(err => logger.error(err));
    } else {
      let reply = `Transformations for redirection [<code>${data.redirectionId}</code>]\n\n`;
      reply += '<b>ID | Rank | Old Phrase | New Phrase</b>\n';
      transformations.forEach(transformation => {
        reply += `<code>${transformation.id}. [${transformation.rank}] ${transformation.old_phrase} ==> ${transformation.new_phrase}</code>\n`;
      });
      bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(err => logger.error(err));
    }
  } catch (err) {
    logger.error(err);
    bot.sendMessage(msgEvent.chat.id, `❌ ${err}`).catch(err => logger.error(err));
  }
});

commandHandler.on('/transformremove', async (data, msgEvent) => {
  try {
    await removeTransformation(msgEvent.chat.id, data.transformationId);
    const reply = `✔ Transformation removed <code>${data.transformationId}</code>`;
    bot.sendMessage(msgEvent.chat.id, reply, { parse_mode: 'HTML' }).catch(err => logger.error(err));
  } catch (err) {
    logger.error(err);
    bot.sendMessage(msgEvent.chat.id, `❌ ${err}`).catch(err => logger.error(err));
  }
});

//   } else if (command === '/transformrank') {
//     try {
//       await swapTransformationRank(
//         sender,
//         parsedMsg.redirectionId,
//         parsedMsg.rank1,
//         parsedMsg.rank2
//       );
//       let reply = `Transformation rank swapped for redirection id \`${parsedMsg.redirectionId}\`\n\n`;
//       reply += `\`${parsedMsg.rank1} <==> ${parsedMsg.rank2}\``;
//       bot
//         .send_message(sender, reply, 'markdown')
//         .catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }

if (require.main === module) {
  bot.on('message', msg => logger.info(msg));
  bot.on('polling_error', err => logger.error(err));
  bot.startPolling();
}
