from flask import Flask, request, jsonify
from telethon import TelegramClient, events, sync
from telethon.tl.functions.channels import JoinChannelRequest

# Start Telegram Client
api_id = 601228
api_hash = '9fc04c4cb1b667dd574f734c4b9d2a5e'
client = TelegramClient('../session_name.session', api_id, api_hash)
client.start()

# Create the application instance
app = Flask(__name__)


def joinChannel(channel):
  try:
    result = client(JoinChannelRequest(channel))
    return result
  except ValueError as valErr:
    return valErr

@app.route('/joinchannel')
def home():
  channel = request.args.get('channel')
  print('[/joinchannel] :: Channel Name {}'.format(channel))

  return joinChannel(channel)


# If we're running in stand alone mode, run the application
if __name__ == '__main__':
  app.run(debug=True)
