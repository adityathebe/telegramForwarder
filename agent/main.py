import requests as request
from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest
from config.main import api_id, api_hash

client = TelegramClient('session_name', api_id, api_hash)
client.start()

@client.on(events.NewMessage)
def my_event_handler(event):
  print(event)
  if 'hello' in event.raw_text:
    event.reply('hi!')

client.run_until_disconnected()
