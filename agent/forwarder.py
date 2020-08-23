import logging
from client import client
from db.database import Database
from utils.filter import MessageFilter
from utils.transformation import MessageTransformation


logger = logging.getLogger('Forwarder')
database = Database()


async def forwarder_event_handler(event):
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
        logger.info('Channel Message Received')
        sender_id = event.message.to_id.channel_id

    elif is_group:
        logger.info('Group Message Received')
        sender_id = event.message.to_id.chat_id

    elif is_private:
        logger.info('Private Message Received')
        sender_id = event.from_id if has_media else event.original_update.user_id

    else:
        logger.info('Invalid Sender Type', event)

    logger.info('Message : {}'.format(message))
    logger.info('Sender : {}'.format(sender_id))

    # Mark as read
    user_entity = await client.get_input_entity(sender_id)
    await client.send_read_acknowledge(user_entity, max_id=event.original_update.pts)

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
                if should_filter:
                    return

                if has_media:
                    await client.send_file(destination, event.media)
                else:
                    transformed_message = MessageTransformation.get_transformed_msg(
                        event, redirection_id)
                    await client.send_message(destination, transformed_message)

            else:
                await client.forward_messages(destination, event.message.id, sender_id)
            logger.info('Message sent to {}'.format(destination))

    except Exception as err:
        logger.error(err)
