// @ts-check
const EventEmitter = require('events').EventEmitter;

const db = require('./db/database');
const MessageParser = require('./controllers/message/parser');

// Controllers
// const addFilter = require('../addFilter');
// const getFilter = require('../getFilter');
const addRedirection = require('./controllers/addRedirection');
// const addTransformation = require('../addTransformation');
// const swapTransformationRank = require('../swapTransformationRank');
// const removeRedirection = require('../removeRedirection');
// const activateRedirection = require('../activateRedirection');
// const deactivateRedirection = require('../deactivateRedirection');
// const getTransformations = require('../getTransformations');
// const removeTransformation = require('../removeTransformation');

class CommandHandler extends EventEmitter {}
const commandHandler = new CommandHandler();

const bot = require('./services/telegram');
bot.onText(new RegExp('^/start$'), async (msgEvent) => {
  let reply = 'Welcome to MultiFeed Bot! 🔥\n\n';
  reply += 'Send /help to get usage instructions';
  bot.sendMessage(msgEvent.chat.id, reply).catch(console.error);

  // Store User to Database
  await db.saveUser(msgEvent.chat.id, msgEvent.from.username, Math.random() * 1000);
});

bot.onText(new RegExp('^/help$'), (msgEvent) => {
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

bot.on('polling_error', console.error);

bot.on('message', (msgEvent) => {
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
    if (command === '/help' || command === '/start') return;

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
    const { redirectionId, error } = await addRedirection(msgEvent.chat.id, data.source, data.destination);
    if (error) {
      return bot
        .sendMessage(msgEvent.chat.id, error, {
          parse_mode: 'HTML',
        })
        .catch((e) => console.error(e.message));
    }
    const reply = `New Redirection added with <code>[${redirectionId}]</code>`;
    return bot.sendMessage(msgEvent.chat.id, reply, {
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error(err);
    const reply = err.message || err || 'Some error occured';
    bot
      .sendMessage(msgEvent.chat.id, reply, {
        parse_mode: 'HTML',
      })
      .catch(console.error);
  }
});

// const handlePrivateMessage = async (sender, messageEvent) => {
//   const username = messageEvent.from.username;
//   const message = messageEvent.text;
//   const forwarded = messageEvent.forward_from_chat;

//   console.log(`\nPRIVATE MESSAGE: ${username} - ${message}`);

//   if (command === '/add') {
//
//   } else if (command === '/remove') {
//     try {
//       const removeRedirectionResponse = await removeRedirection(
//         sender,
//         parsedMsg.redirectionId
//       );
//       const reply = `Redirection removed <code>[${parsedMsg.redirectionId}]</code>`;
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   } else if (command === '/activate') {
//     try {
//       await activateRedirection(sender, parsedMsg.redirectionId);
//       const reply = `Redirection activated <code>[${parsedMsg.redirectionId}]</code>`;
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   } else if (command === '/deactivate') {
//     try {
//       await deactivateRedirection(sender, parsedMsg.redirectionId);
//       const reply = `Redirection deactivated <code>[${parsedMsg.redirectionId}]</code>`;
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   } else if (command === '/list') {
//     try {
//       const redirections = await db.getRedirections(sender);
//       if (redirections.length === 0) {
//         return bot
//           .send_message(sender, 'You have no redirections')
//           .catch(err => console.log(err));
//       }

//       let reply = '';
//       redirections.forEach(redirection => {
//         let state = redirection.active == 1 ? '🔵' : '🔴';
//         reply += `--- ${state} <code>[${redirection.id}]</code> ${redirection.source_title} => ${redirection.destination_title}\n`;
//       });
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       console.log(err);
//       bot.send_message(sender, err);
//     }
//   } else if (command === '/filter') {
//     try {
//       const response = await addFilter(sender, parsedMsg);
//       let reply = `✅ Command Success.\n\n<code>`;
//       reply += `- Redirection id : [${response.filterData.redirectionId}]\n`;
//       reply += `- Filter Name : ${response.filterData.name}\n`;
//       reply += `- Filter State : ${response.filterData.state}</code>`;
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   } else if (command === '/filters') {
//     try {
//       const filter = await getFilter(sender, parsedMsg.filterId);
//       let reply = `✅ Filters for redirection <code>[${filter.id}]</code>\n\n`;
//       reply += '<code>';
//       reply += `- ${filter.audio === 1 ? '🔵' : '🔴'} audio\n`;
//       reply += `- ${filter.video === 1 ? '🔵' : '🔴'} video\n`;
//       reply += `- ${filter.photo === 1 ? '🔵' : '🔴'} photo\n`;
//       reply += `- ${filter.sticker === 1 ? '🔵' : '🔴'} sticker\n`;
//       reply += `- ${filter.document === 1 ? '🔵' : '🔴'} document\n`;
//       reply += `- ${filter.hashtag === 1 ? '🔵' : '🔴'} hashtag\n`;
//       reply += `- ${filter.link === 1 ? '🔵' : '🔴'} link\n`;
//       reply += `- ${filter.contain ? '🔵' : '🔴'} contain = ${
//         filter.contain ? filter.contain.replace(/<stop_word>/g, ', ') : null
//       }\n`;
//       reply += `- ${filter.notcontain ? '🔵' : '🔴'} notcontain = ${
//         filter.notcontain
//           ? filter.notcontain.replace('<stop_word>', ', ')
//           : null
//       }`;
//       reply += '</code>';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   } else if (command === '/transform') {
//     try {
//       const response = await addTransformation(
//         sender,
//         parsedMsg.redirectionId,
//         parsedMsg.oldPhrase,
//         parsedMsg.newPhrase
//       );
//       const reply = `New transformation added with id <code>${response.transformationId}</code>`;
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
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
//   } else if (command === '/transforms') {
//     try {
//       const transformations = await getTransformations(
//         sender,
//         parsedMsg.redirectionId
//       );
//       let reply = `Transformations for redirection <code>${parsedMsg.redirectionId}</code>\n\n`;
//       reply += '<b>ID | Rank | Old Phrase | New Phrase</b>\n';
//       transformations.forEach(transformation => {
//         reply += `<code>${transformation.id}. [${transformation.rank}] ${transformation.old_phrase} ==> ${transformation.new_phrase}</code>\n`;
//       });
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   } else if (command === '/transformremove') {
//     try {
//       await removeTransformation(sender, parsedMsg.transformationId);
//       let reply = `Transformation removed <code>${parsedMsg.transformationId}</code>`;
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     } catch (err) {
//       const reply = err.message || err || 'Some error occured';
//       bot.send_message(sender, reply).catch(err => console.log(err));
//     }
//   }
// };

if (require.main === module) {
  bot.startPolling();
}
