import os
import sys
import logging
sys.path.append("..")
logging.basicConfig(level=logging.ERROR)

# Telegram Imports
from config.main import api_id, api_hash
from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest

# Import Filter
from filter import Filter

# Connect to database
from db.database import Database
database = Database()

# Connect to Telegram
session_path = os.path.abspath('../session_name.session')
client = TelegramClient(session_path, api_id, api_hash)
client.session.save_entities = True

@client.on(events.NewMessage)
def my_event_handler(event):

  # Ignore Outgoing Message Updates
  is_outgoing_message = event.out
  if (is_outgoing_message):
    return print('Ignore outgoing message')

  is_group = event.is_group
  is_channel = event.is_channel
  is_private = event.is_private
  message = event.message.message
  has_media = event.media
  sender_id = None

  if is_channel:
    print('\n\n# Channel Message')
    sender_id = event.message.to_id.channel_id

  elif is_group:
    print('\n\n# Group Message')
    sender_id = event.message.to_id.chat_id

  elif is_private:
    print('\n\n# Private Message')
    sender_id = event.from_id if has_media else event.original_update.user_id

  else:
    print('Invalid Sender Type', event)

  print('Message : {}'.format(message))
  print('Sender : {}'.format(sender_id))

  # Mark as read
  client.send_read_acknowledge(sender_id, max_id=event.original_update.pts)

  # Get all Receivers of given userid
  try:
    redirections = database.get_redirections_of_source(sender_id)
    for redirection in redirections:
      redirection_id = redirection[0]
      user_id = redirection[1]
      source = redirection[2]
      destination = int(redirection[3])

      # Get User from database
      user = database.get_user(user_id)
      user_is_premium = user[4]

      # Allow premium users only
      if user_is_premium == 1:
        should_filter = Filter.filter_msg(redirection_id, event)
        if should_filter:
          return print('Filtered out')

        if has_media:
          client.send_file(destination, event.media)
        else:
          client.send_message(destination, message)

      # else:
        # client.forward_messages(destination, event.message.id, sender_id)
      print('Message sent to {}'.format(destination))

  except Exception as err:
    print(err)


if __name__ == "__main__":
  response = client.start()
  print('Logged in as @{}'.format(response.get_me().username))
  client.run_until_disconnected()
