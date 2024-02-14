FROM node:20-slim

ARG NODE_ENV
ARG PORT

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .
 
CMD [ "npm", "run", "dev" ]
