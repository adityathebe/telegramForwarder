import sys
sys.path.append("..")
from flask import Flask, request, jsonify
from telethon import TelegramClient, events #, sync
from telethon.tl.functions.channels import JoinChannelRequest
from config.main import api_id, api_hash

# Start Telegram Client
client = TelegramClient('../session_name.session', api_id, api_hash)
client.start()

# Create the application instance
app = Flask(__name__)


@app.route('/joinchannel')
def home():
  channel = request.args.get('channel')
  print('[/joinchannel] :: Channel Name {}'.format(channel))
  try:
    result = client(JoinChannelRequest(channel))
    return jsonify(result.chats[0].to_dict())
  except Exception as exception:
    return jsonify({'error': str(exception)})


@app.route('/getentity')
def getEntity():
  entity = request.args.get('entity')
  print('[/getentity] :: Entity Name {}'.format(entity))
  try:
    result = client.get_entity(entity).to_dict()
    return jsonify(result)
  except Exception as exception:
    return jsonify({'error': str(exception)})

if __name__ == '__main__':
  app.run(debug=True)
