import json
import logging
from client import telegram_client
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

    logger.info(f'Message : {message}')
    logger.info(f'Sender : {sender_id}')

    # Mark as read (Optional)
    user_entity = await telegram_client.get_input_entity(sender_id)
    await telegram_client.send_read_acknowledge(user_entity, max_id=event.original_update.pts)

    # Get all Receivers of given userid
    try:
        redirections = database.get_active_redirections_of_source(sender_id)
        logger.info(f"Active Redirections: {json.dumps(redirections)}")
        for redirection in redirections:
            redirection_id = redirection[0]
            author_id = int(redirection[1])
            source = int(redirection[2])
            destination = int(redirection[3])

            if source != sender_id:
                logger.info("Source != Sender")
                continue

            # Get User from database
            user = database.get_user(author_id)
            is_user_premium = user[4]

            # Allow premium users only
            if is_user_premium == 1:
                should_filter = MessageFilter.filter_msg(redirection_id, event)
                if should_filter:
                    return

                if has_media:
                    await telegram_client.send_file(destination, event.media, caption=message)
                else:
                    transformed_message = MessageTransformation.get_transformed_msg(
                        event, redirection_id)
                    await telegram_client.send_message(destination, transformed_message)

            else:
                await telegram_client.forward_messages(destination, event.message.id, sender_id)
            logger.info(f'Message sent to {destination}')

    except Exception as err:
        logger.error(err)
