from telethon import TelegramClient, events, sync
from config import api_id, api_hash

telegram_client = TelegramClient('telethon', api_id, api_hash)
