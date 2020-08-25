FROM node:lts-jessie

RUN apt-get update 

WORKDIR /usr/src/telegram-forwarder/bot

COPY package.json .

RUN npm install

COPY . .

CMD ["npx", "nodemon", "bot.js"]