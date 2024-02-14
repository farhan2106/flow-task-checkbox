FROM node:20 AS build

ARG NODE_ENV

WORKDIR /usr/src/app

EXPOSE 1234

COPY package.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
