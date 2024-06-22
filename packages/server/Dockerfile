FROM node:20-alpine

RUN mkdir -p /home/node/server && chown -R node:node /home/node/server
WORKDIR /home/node/server
USER node
COPY --from=root --chown=node:node ./node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 6969

CMD [ "node", "dist/index.js" ]