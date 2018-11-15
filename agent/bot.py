import requests as request
from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.functions.messages import ImportChatInviteRequest
from config.main import api_id, api_hash
from config.main import DB_database_session, DB_host, DB_passwd, DB_user

# SqlAlchemy Session
from alchemysession import AlchemySessionContainer
container = AlchemySessionContainer('mysql://{}:{}@{}/{}'.format(
    DB_user, DB_passwd, DB_host, DB_database_session
))
session = container.new_session('synapticSupportForwarder')
client = TelegramClient(session, api_id, api_hash)

try:
  client.start()
  resp = client.send_message('mintlemonade', '451722605')
  print(resp)
except Exception as exception:
  print(exception)
