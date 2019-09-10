const express = require('express');
const bodyParser = require('body-parser');

// Initialize && Connect to Database
require('./db/database');

// Create a TelegramBot Object
const { PORT, TG} = require('./config');
const TelegramBot = require('./services/telegram');
const bot = new TelegramBot(TG.TG_API_KEY, TG.TG_BOT_USERNAME);

// Set up Server
const PORT = process.env.PORT || port;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

////////////
// Routes //
////////////
const homeRoute = require('./routes/home');
const agentRoute = require('./routes/agent');
const webhookRoute = require('./routes/webhook');
app.use('/', homeRoute);
app.use('/agent', agentRoute);
app.use('/webhook', webhookRoute);

if (require.main === module) {
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Listening at port ${PORT}`);
  });
}

module.exports = bot;