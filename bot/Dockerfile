FROM node:lts-jessie

RUN apt-get update

RUN apt-get install -y netcat

WORKDIR /usr/src/telegram-forwarder/bot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "bot.js"]