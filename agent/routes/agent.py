import sys
sys.path.append("..")
from flask import Flask, request, jsonify
from telethon import TelegramClient, events, sync
from telethon.tl.functions.channels import JoinChannelRequest
from config.main import api_id, api_hash

# Start Telegram Client
client = TelegramClient('../session_name.session', api_id, api_hash)
client.start()

# Create the application instance
app = Flask(__name__)


def joinChannel(channel):
  try:
    result = client(JoinChannelRequest(channel))
    return jsonify(result.chats[0].to_dict())
  except ValueError as valErr:
    return jsonify({'error': str(valErr)})


@app.route('/joinchannel')
def home():
  channel = request.args.get('channel')
  print('[/joinchannel] :: Channel Name {}'.format(channel))
  return joinChannel(channel)


# If we're running in stand alone mode, run the application
if __name__ == '__main__':
  app.run(debug=True)
