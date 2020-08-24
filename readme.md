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

# Issues

- [x] Join private entities via invitation link
- [x] Duplicate redirection
- [ ] Multiple Worker Agents
- [ ] utf8 encoding mysql database

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

Q: How to setup a Private bot plan?  
A: Contact our support for details or leave your contact in the form below.
