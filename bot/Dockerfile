FROM node:lts-jessie

RUN apt-get update 

WORKDIR /usr/src/telegram-forwarder/agent

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]