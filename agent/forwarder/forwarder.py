import os
import sys
import logging
sys.path.append("..")
logging.basicConfig(level=logging.ERROR)

# Telegram Imports
from config.main import api_id, api_hash, session_name_forwarder
from config.main import DB_SESSION_DBNAME, DB_host, DB_passwd, DB_user
from telethon import TelegramClient, events
from telethon.tl.functions.channels import JoinChannelRequest

# Import MessageFilter
from filter import MessageFilter

# Import MessageTransformation
from transformation import MessageTransformation

# Connect to database
from db.database import Database
from db.session_db import SessionDatabase
database = Database()
session_db = SessionDatabase()

# Connect to Telegram
from alchemysession import AlchemySessionContainer
container = AlchemySessionContainer('mysql://{}:{}@{}/{}'.format(
    DB_user, DB_passwd, DB_host, DB_SESSION_DBNAME
))
session = container.new_session(session_name_forwarder)
client = TelegramClient(session, api_id, api_hash)


@client.on(events.NewMessage)
def my_event_handler(event):

  # Ignore Outgoing Message Updates
  if (event.out):
    return

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
  try:
    user_entity = client.get_input_entity(sender_id)
    client.send_read_acknowledge(user_entity, max_id=event.original_update.pts)
  except Exception as e:
    user_entity_db = session_db.get_entity(sender_id)
    if user_entity_db is not None:
      session_db.save_entity(session_name_forwarder, user_entity_db)

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
        should_filter = MessageFilter.filter_msg(redirection_id, event)
        if should_filter: return 

        # Check if entity is in the session database
        try:
          client.get_input_entity(destination)
        except Exception as e:
          destination_entity = session_db.get_entity(destination)
          destination = destination_entity[3]

        if has_media:
          client.send_file(destination, event.media)
        else:
          transformed_message = MessageTransformation.get_transformed_msg(event, redirection_id)
          client.send_message(destination, transformed_message)

      # else:
        # client.forward_messages(destination, event.message.id, sender_id)
      print('Message sent to {}'.format(destination))

  except Exception as err:
    print(err)


if __name__ == "__main__":
  response = client.start()
  print('Logged in as @{}'.format(response.get_me().username))
  client._handle_auto_reconnect()
  client.run_until_disconnected()
