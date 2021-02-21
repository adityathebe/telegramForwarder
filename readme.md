# Telegram Forwarder Bot

- Automatically forward messages from Channels and Groups (private or public)
- Group channels into Thematic feeds
- Clone all messages from any channel to your own channel

# Pre Installation

Get your Telegram Api Id and Hash Id from here [https://my.telegram.org/auth?to=apps](https://my.telegram.org/auth?to=apps)

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

# Access database from the docker container

If you've already installed `psql` or any other Postgres GUI tools then you can simply connect to the database as the port `5432` is exposed and mapped to the host system's port `5432`.

However, if you don't have any of those tools and don't want to bother installing them, you can simply get an interactive shell on the docker container and access database from there. If you run the command below, you will get a shell on the postgres docker container

```bash
docker container exec -it telegramforwarder_postgres-db_1 bash
```

Once you are logged in, you have to install `sudo`

```bash
apk add sudo
sudo -u postgres -i
# https://stackoverflow.com/a/11919677/6199444
```

Then you can simply connect to postgres

```
psql
\c telegram
```

```sql
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

Q: I don't have a link of a chat/group. Can I still setup forwarding from it?
A: Yes.

Q: Can I clone all the messages from some channel to my own channel?  
A: Yes.
