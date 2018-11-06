import requests as request
from telethon import TelegramClient, events, sync
from telethon.tl.functions.channels import JoinChannelRequest
from config.main import api_id, api_hash

client = TelegramClient('session_name', api_id, api_hash)
client.start()

def joinChannel(channel):
  try:
    result = client(JoinChannelRequest(channel))
    return result
  except ValueError as valErr:
    return valErr

resp = joinChannel('gex123Channel')
print(resp)

# @client.on(events.NewMessage)
# async def my_event_handler(event):
#   print(event)
#   if 'hello' in event.raw_text:
#     await event.reply('hi!')

# client.run_until_disconnected()
