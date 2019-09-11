# Telegram Forwarder Bot

- Automatically forward messages from Channels and Groups (private or public)
- Group channels into Thematic feeds
- Clone all messages from any channel to your own channel

## Get Telegram Api Id and Hash Id

[https://my.telegram.org/auth?to=apps](https://my.telegram.org/auth?to=apps)

# Installation

## 1. Clone Repository

```bash
sudo apt update && sudo apt upgrade
git clone https://github.com/adityathebe/telegramForwarder.git
```

## 2. Install Mysql server && Create Databases

```bash
sudo apt-get install mysql-server
sudo apt-get install libmysqlclient-dev
mysql_secure_installation
```

#### Create the required Databases && Tables
```bash
mysql -u root -p
# Run the commands on bot/db/init.sql
```

#### Manage permission for mysql root user
```bash
$ mysql -u root -p

mysql> USE mysql;
mysql> UPDATE user SET plugin='mysql_native_password' WHERE User='root';
mysql> FLUSH PRIVILEGES;
mysql> exit;

$ service mysql restart
```

> **NOTE**: Might need to run `mysql_secure_installation` command after this 


## 3. Install Python and required Packages
```bash
sudo apt install python3
sudo apt install python3-pip
cd agent
pip3 install -r requirements.txt
```

## 4. Install Nodejs and required Pacakges
```bash
sudo apt install nodejs
sudo apt install npm
cd bot
npm install -g pm2
npm install
```

## 5. Run the bot

Before running the node scripts, we need to configure the config files `bot/config/*`
Take a look at the samples `bot/config/sample-*.js`

```bash
cd bot
pm2 start app.js
```

## 6. Run the python forwarder and Flask server

Before running the python scripts, we need to configure the config file `agent/config/main.py`.
Take a look at the sample `agent/config/config-sample.py`

```bash
tmux new -s telethon

# Open two tmux panes
ctrl + b + %

# Run server
cd agent/api
python3 server.py

# Run Forwarder
Ctrl + b + RIGHT ARROW
cd agent/forwarder
python3 forwarder.py

# Detach from session
Ctrl + b + d
```

# Issues

- [x] Join private entities via invitation link
- [x] Duplicate redirection
- [x] Shareable session
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

