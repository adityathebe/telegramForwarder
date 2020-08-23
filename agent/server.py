import logging
import telethon
import hypercorn.asyncio
from quart import Quart, request
from telethon import TelegramClient, events, sync
from telethon.tl.functions.messages import ImportChatInviteRequest
from telethon.tl.functions.channels import JoinChannelRequest
from config.main import api_id, api_hash


format_str = '[%(levelname)s] %(filename)s:%(lineno)s -- %(message)s'
logging.basicConfig(level=logging.INFO, format=format_str)


client = TelegramClient('telethon', api_id, api_hash)

# Create Flask application instance
app = Quart(__name__)


######################
# Join Private Users #
######################
@app.route('/joinPublicUserEntity')
async def joinPublicUserEntity():
    entity = request.args.get('entity')

    print('[/joinPublicUserEntity] :: Entity Name {}'.format(entity))
    try:
        msg = '/start'
        result = await client.send_message(entity, msg)
        return result.to_dict()
    except Exception as exception:
        return {'error': str(exception)}


@app.route('/joinPublicEntity')
async def joinPublicEntity():
    """
    Join Public Groups & Channels
    """
    entity = request.args.get('entity')
    print('[/joinPublicEntity] :: Entity Name {}'.format(entity))
    try:
        result = await client(JoinChannelRequest(entity))
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
    print('[/joinPrivateEntity] :: Hash {}'.format(hash))
    try:
        result = await client(ImportChatInviteRequest(hash))
        return result.chats[0].to_dict()
    except telethon.errors.rpcerrorlist.UserAlreadyParticipantError:
        return {'succes': 'ok'}
    except Exception as exception:
        print(type(exception))
        return {'error': str(exception)}


@app.route('/')
def x():
    return 200


@app.route('/getentity', methods=['GET'])
async def getEntity():
    entity = request.args.get('entity')
    is_entity_id = request.args.get('is_id') or '0'

    if (is_entity_id == '1'):
        entity = int(entity)

    app.logger.info('[/getentity] :: Entity Name {}'.format(entity))
    try:
        result = await client.get_entity(entity)
        return result.to_dict()
    except Exception as exception:
        print(exception)
        return {'error': str(exception)}


@app.before_serving
async def startup():
    await client.start()
    user = await client.get_me()
    app.logger.info('Logged in as @{}'.format(user.username))


@app.after_serving
async def cleanup():
    await client.disconnect()


async def main():
    await hypercorn.asyncio.serve(app, hypercorn.Config())


if __name__ == "__main__":
    client.loop.run_until_complete(main())
