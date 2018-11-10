import sys
sys.path.append("..")
from flask import Flask, request, jsonify
import telethon
from telethon import TelegramClient, events  # , sync
from telethon.tl.functions.channels import JoinChannelRequest
from telethon.tl.functions.messages import ImportChatInviteRequest
from config.main import api_id, api_hash

# Start Telegram Client
client = TelegramClient('../session_name.session', api_id, api_hash)
client.start()

# Create the application instance
app = Flask(__name__)

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


if __name__ == '__main__':
  app.run()
  # app.run(debug=True)
