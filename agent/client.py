from telethon import TelegramClient, events, sync
from config.main import api_id, api_hash

client = TelegramClient('../database/telethon', api_id, api_hash)
