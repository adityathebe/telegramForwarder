import requests as request
from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.functions.messages import ImportChatInviteRequest
from config.main import api_id, api_hash

session = './session_name.session'
client = TelegramClient(session, api_id, api_hash)
client.start()

try:
  client.send_message('@adityathebe', '**hi** there')
except Exception as exception:
  print(exception)

