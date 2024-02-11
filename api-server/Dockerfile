FROM node:20-slim

ARG NODE_ENV
ARG PORT

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# COPY . ./

# RUN npm run build

# CMD [ "npm", "start" ]
CMD [ "npm", "run", "dev" ]
