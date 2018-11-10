import os
import requests as request
from config.main import api_id, api_hash

# Connect to Telegram
from telethon.tl.functions.channels import JoinChannelRequest
from telethon import TelegramClient, events
session_path = os.path.join(os.path.dirname(__file__), 'session_name.session')
client = TelegramClient(session_path, api_id, api_hash)
response = client.start()
print('Logged in as @{}'.format(response.get_me().username))

# Connect to database
from db.database import Database
database = Database()

@client.on(events.NewMessage)
def my_event_handler(event):

  # Ignore Outgoing Message Updates
  is_outgoing_message = event.out
  if (is_outgoing_message): return

  is_group = event.is_group
  is_channel = event.is_channel
  is_private = event.is_private
  message = event.message.message
  sender_id = None

  if is_channel:
    print('Channel Message')
    sender_id = event.message.to_id.channel_id
  
  elif is_group:
    print('Group Message')
    sender_id = event.message.to_id.chat_id

  elif is_private:
    print('Private Message')
    sender_id = event.original_update.user_id

  else:
    print('Invalid Sender Type', event)
  
  print({'sender': sender_id, 'message': message})

  # Get all Receivers of given userid
  try:
    redirections = database.get_redirections_of_source(sender_id)
    for redirection in redirections:
      user_id = redirection[1]
      source = redirection[2]
      destination = int(redirection[3])

      # Get User from database
      user = database.get_user(user_id)
      user_is_premium = user[4]

      if user_is_premium:
        client.send_message(destination, message)
      else:
        client.forward_messages(destination, event.message.id, sender_id)
  except Exception as err:
    print(err)

  # Mark as read
  try:
    client.send_read_acknowledge(sender_id, max_id=event.original_update.pts)
  except Exception as ex:
    print(ex)
  

client.run_until_disconnected()
