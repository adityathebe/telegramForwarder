# Telegram Forwarder Bot

- Automatically forward messages from Channels and Groups (private or public)
- Group channels into Thematic feeds
- Clone all messages from any channel to your own channel

# Pre Installation

You'll require two different api keys. One for the telegram bot api and one for the telegram account used as an agent.

## A. Bot API

Telegram offers a neat way to create api keys for telegram bots. You need to message [@botfather](https://t.me/botfather) - a telegram bot to get create new bots! The bot will guide you through the process of creating and managing new bots and the api keys.

![Create Telegram bot with @botfather](https://i.imgur.com/DNeoeTO.png)

## B. Telegram API

To get the API id and Hash id for the telegram account visit [https://my.telegram.org/auth?to=apps](https://my.telegram.org/auth?to=apps)

![](https://i.imgur.com/KJ1kDDO.png)

# Installation

Clone the repository

```bash
git clone https://github.com/adityathebe/telegramForwarder.git
```

## 1. Docker (Recommended)

The `docker-compose` file requires few environment variables. Create a `.env` file in the root directory. Docker compose will automatically pull the required environment variables from this file. Here's an example of my `.env` file

```docker
TG_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TG_API_ID=XXXX
TG_HASH_ID=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TG_BOT_USERNAME=@XXXXXXXXXXXXXXXXXbot
```

With that set up you're ready to go !

```bash
docker-compose up
```

> Things might go wrong the first time you run this command. If that happens, stop the process and re-run the command

## 2. Manual

### 1. Install Python Packages

```bash
cd agent
pip install -r requirements.txt
```

### 2. Install Nodejs Packages

```bash
cd bot
npm install
```

### 3. Install and setup postgress

Install the postgres server and create a new database named `telegram`.

### 4. Run everything

# Post Installation

Once you get the database, python agent and node server running, you need to login with the telegram account that you want to use as the forwarder agent.

Visit [http://localhost:3000/login](http://localhost:3000/login) to login

# Things to keep in mind

1. If you're running the code via docker and docker-compose then you'll need to rebuild the docker images after pulling new updates.

```
docker-compose up --build
```

2. Docker will persist the postgres database even after you stop the docker containers. If for some reason you want to start fresh and clean the database you need to purge the docker volume.

```
docker-compose down -v
```

# Access database from the docker container

If you've already installed `psql` or any other Postgres GUI tools then you can simply connect to the database as the port `5432` is exposed and mapped to the host system's port `5432`.

However, if you don't have any of those tools and don't want to bother installing them, you can simply get an interactive shell on the docker container and access database from there. If you run the command below, you will get a shell on the postgres docker container

```bash
docker container exec -it telegramforwarder_postgres-db_1 psql -U postgres
```

> Note 1: The PostgreSQL image sets up trust authentication locally so you may notice a password is not required when connecting from localhost (inside the same container). However, a password will be required if connecting from a different host/container.

```sql
-- \c telegram
select * FROM users;
```

### FAQ:

-Q: How to start using the bot?  
A: Send /start command to the bot and follow the instructions.

Q: Does the bot need admin permissions in a channel/group it forwards from?  
A: No.

Q: Does the bot need admin permissions in a channel/group it forwards to?  
A: Yes.

Q: Can I filter out ads or media content (videos, stickers, etc.)?  
A: Yes.

Q: Can I set up automatic forwarding from another bot?  
A: Yes.
