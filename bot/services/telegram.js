const TelegramBot = require('node-telegram-bot-api');

const config = require('../config');

const bot = new TelegramBot(config.TG.TG_API_KEY, { polling: false });
module.exports = bot;
