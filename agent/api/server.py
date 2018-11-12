import os
import sys
import logging
sys.path.append("..")
logging.basicConfig(level=logging.ERROR)

# Flask Import
from flask import Flask, request, jsonify

# Telegram Imports
import telethon
from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.functions.messages import ImportChatInviteRequest
from config.main import api_id, api_hash

# Connect to Telegram
session_path = os.path.abspath('../session_name.session')
client = TelegramClient(session_path, api_id, api_hash)

# Create the application instance
app = Flask(__name__)

######################
# Join Private Users #
######################
@app.route('/joinPublicUserEntity')
def joinPublicUserEntity():
  entity = request.args.get('entity')
  is_bot = request.args.get('is_bot')

  print('[/joinPublicUserEntity] :: Entity Name {}'.format(entity))
  try:
    msg = '/start'
    result = client.send_message(entity, msg)
    return jsonify(result.to_dict())
  except Exception as exception:
    return jsonify({'error': str(exception)})

#################################
# Join Public Groups & Channels #
#################################
@app.route('/joinPublicEntity')
def joinPublicEntity():
  entity = request.args.get('entity')
  print('[/joinPublicEntity] :: Entity Name {}'.format(entity))
  try:
    result = client(JoinChannelRequest(entity))
    return jsonify(result.chats[0].to_dict())
  except telethon.errors.rpcerrorlist.UserAlreadyParticipantError:
    return jsonify({'succes': 'ok'})
  except Exception as exception:
    return jsonify({'error': str(exception)})

######################
# Join Invation Link #
######################
@app.route('/joinPrivateEntity')
def joinPrivateEntity():
  hash = request.args.get('hash')
  print('[/joinchannel] :: Hash {}'.format(hash))
  try:
    result = client(ImportChatInviteRequest(hash))
    return jsonify(result.chats[0].to_dict())
  except telethon.errors.rpcerrorlist.UserAlreadyParticipantError:
    return jsonify({'succes': 'ok'})
  except Exception as exception:
    print(type(exception))
    return jsonify({'error': str(exception)})


@app.route('/getentity')
def getEntity():
  entity = request.args.get('entity')
  is_entity_id = request.args.get('is_id') or '0'

  if (is_entity_id == '1'):
    entity = int(entity)

  print('[/getentity] :: Entity Name {}'.format(entity))
  try:
    result = client.get_entity(entity).to_dict()
    return jsonify(result)
  except Exception as exception:
    return jsonify({'error': str(exception)})

if __name__ == "__main__":
  response = client.start()
  print('Logged in as @{}'.format(response.get_me().username))
  app.logger.disabled = True
  app.run()
