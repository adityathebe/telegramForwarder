const bot = require('../../app');
const db = require('../../db/database');

const handlePrivateMessage = (sender, messageEvent) => {

  const username = messageEvent.from.username;
  const message = messageEvent.text;
  const forwarded = messageEvent.forward_from_chat;

  console.log(`\nPRIVATE MESSAGE: ${username} - ${message}`);

  if (message == '/start') {
    const reply = "Hey there !";
    bot.send_message(sender, reply).catch(err => console.log(err));
  }
}

module.exports = handlePrivateMessage;