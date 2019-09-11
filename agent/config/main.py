import os

API_PORT = os.environ['API_PORT']

# Telegram configs
api_id = os.environ['TG_API_ID']
api_hash = os.environ['TG_HASH_ID']

# Database configs
DB_host = os.environ['MYSQL_HOST']
DB_user = os.environ['MYSQL_USER']
DB_passwd = os.environ['MYSQL_PASSWORD']
DB_database = os.environ['MYSQL_DB_NAME']
DB_SESSION_DBNAME = "telethonsession"

# Telethon Session settings
TELETHON_SESSION_ID = 'synapticSupport'
session_name_forwarder = 'synapticSupportForwarder'
