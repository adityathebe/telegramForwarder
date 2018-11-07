const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize && Connect to Database
const database = require('./db/database');

// Create a TelegramBot Object
const SERVER_CONFIG = require('./config/server');
const TELEGRAM_CONFIG = require('./config/telegram');
const TelegramBot = require('./services/telegram');
const bot = new TelegramBot(TELEGRAM_CONFIG.apiKey, TELEGRAM_CONFIG.username);
// bot.setWebhook(TELEGRAM_CONFIG.webhookUrl);
module.exports = bot;
if (require.main !== module) return;

// Set up Server
const PORT = process.env.PORT || SERVER_CONFIG.port;
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

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening at port ${PORT}`);
});
