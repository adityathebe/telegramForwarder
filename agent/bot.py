import requests as request
from telethon import TelegramClient, events, sync
from telethon.tl.functions.channels import JoinChannelRequest
from config.main import api_id, api_hash

client = TelegramClient('session_name', api_id, api_hash)
client.start()

resp = client.get_entity('gexChannel').to_dict()
print(resp)


# @client.on(events.NewMessage)
# async def my_event_handler(event):
#   print(event)
#   if 'hello' in event.raw_text:
#     await event.reply('hi!')

# client.run_until_disconnected()
