import logging
import telethon
import hypercorn.asyncio
from quart import Quart, request, render_template_string
from telethon import TelegramClient, events
from telethon.tl.functions.messages import ImportChatInviteRequest
from telethon.tl.functions.channels import JoinChannelRequest
from client import telegram_client
from config import API_PORT
from forwarder import forwarder_event_handler

format_str = '[%(levelname)s] %(filename)s:%(lineno)s -- %(message)s'
logging.basicConfig(level=logging.INFO, format=format_str)


# Create Flask application instance
app = Quart(__name__)


@app.route('/')
def index():
    return "Telethon API is up and running"


@app.route('/joinPublicUserEntity')
async def joinPublicUserEntity():
    """
    Join Private Users
    """
    entity = request.args.get('entity')

    app.logger.info('[/joinPublicUserEntity] :: Entity Name {}'.format(entity))
    try:
        msg = '/start'
        result = await telegram_client.get_entity(entity)
        return result.to_dict()
    except Exception as exception:
        return {'error': str(exception)}


@app.route('/joinPublicEntity')
async def joinPublicEntity():
    """
    Join Public Groups & Channels
    """
    entity = request.args.get('entity')
    app.logger.info('[/joinPublicEntity] :: Entity Name {}'.format(entity))
    try:
        result = await telegram_client(JoinChannelRequest(entity))
        return result.chats[0].to_dict()
    except telethon.errors.rpcerrorlist.UserAlreadyParticipantError:
        return {'success': 'ok'}
    except Exception as exception:
        return {'error': str(exception)}


@app.route('/joinPrivateEntity')
async def joinPrivateEntity():
    """
    Join Invation Link
    """
    hash = request.args.get('hash')
    app.logger.info('[/joinPrivateEntity] :: Hash {}'.format(hash))
    try:
        result = await telegram_client(ImportChatInviteRequest(hash))
        return result.chats[0].to_dict()
    except telethon.errors.rpcerrorlist.UserAlreadyParticipantError:
        return {'succes': 'ok'}
    except Exception as exception:
        app.logger.error(exception)
        return {'error': str(exception)}


@app.route('/getentity', methods=['GET'])
async def getEntity():
    entity = request.args.get('entity')
    is_entity_id = request.args.get('is_id') or '0'

    if (is_entity_id == '1'):
        entity = int(entity)

    app.logger.info('[/getentity] :: Entity Name {}'.format(entity))
    try:
        result = await telegram_client.get_entity(entity)
        return result.to_dict()
    except Exception as exception:
        app.logger.error(exception)
        return {'error': str(exception)}


@app.before_serving
async def startup():
    await telegram_client.connect()


@app.after_serving
async def cleanup():
    await telegram_client.disconnect()

BASE_TEMPLATE = '''
<!DOCTYPE html>
<html>
    <head>
        <meta charset='UTF-8'>
        <title>Telethon + Quart</title>
    </head>
    <body>{{ content | safe }}</body>
</html>
'''

PHONE_FORM = '''
<form action='/login' method='post'>
    Phone (international format): <input name='phone' type='text' placeholder='+34600000000'>
    <input type='submit'>
</form>
'''

CODE_FORM = '''
<form action='/login' method='post'>
    Telegram code: <input name='code' type='text' placeholder='70707'>
    <input type='submit'>
</form>
'''

phone = None
@app.route('/login', methods=['GET', 'POST'])
async def root():
    # We want to update the global phone variable to remember it
    global phone

    # Check form parameters (phone/code)
    form = await request.form
    if 'phone' in form:
        phone = form['phone']
        await telegram_client.send_code_request(phone)

    if 'code' in form:
        await telegram_client.sign_in(code=form['code'])

    # If we're logged in, show them some messages from their first dialog
    if await telegram_client.is_user_authorized():
        user = await telegram_client.get_me()
        return f'Logged in as @{user.username}'

    # Ask for the phone if we don't know it yet
    if phone is None:
        return await render_template_string(BASE_TEMPLATE, content=PHONE_FORM)

    # We have the phone, but we're not logged in, so ask for the code
    return await render_template_string(BASE_TEMPLATE, content=CODE_FORM)


async def main():
    hypercorn_config = hypercorn.Config()
    hypercorn_config.bind = [f"0.0.0.0:{API_PORT}"]
    await hypercorn.asyncio.serve(app, hypercorn_config)


if __name__ == "__main__":
    telegram_client.on(events.NewMessage)(forwarder_event_handler)
    telegram_client.loop.run_until_complete(main())
