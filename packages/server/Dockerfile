FROM node:20-alpine

RUN mkdir -p /home/node/server && chown -R node:node /home/node/server
WORKDIR /home/node/server
COPY package*.json ./
USER node
RUN npm i
COPY --chown=node:node . .

EXPOSE 6969

CMD [ "node", "dist/index.js" ]