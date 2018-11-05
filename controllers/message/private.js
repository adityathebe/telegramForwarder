const bot = require('../server');

const handlePrivateMessage = (sender, messageEvent) => {

  let username = messageEvent.from.username;
  let message = messageEvent.text;
  let forwarded = messageEvent.forward_from_chat;

  console.log(`\nPRIVATE MESSAGE: ${username} - ${message}`);

  if (forwarded) {
    console.log('Received Forwarded Message!. Ignored  ...')
  }

  else if (message == '/start') {
    let reply = "Hey there !";
    bot.send_message(sender, reply);
  }
}

module.exports = handlePrivateMessage;