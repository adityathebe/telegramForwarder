import os

API_PORT = os.environ['API_PORT']

# Telegram configs
api_id = os.environ['TG_API_ID']
api_hash = os.environ['TG_HASH_ID']

# Database configs
DB_HOST = os.environ.get('DB_HOST') or 'localhost'
DB_SESSION_DBNAME = "telethonsession"

# Telethon Session settings
TELETHON_SESSION_ID = 'synapticSupport'
session_name_forwarder = 'synapticSupportForwarder'