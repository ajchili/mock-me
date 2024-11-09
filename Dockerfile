FROM node:20-alpine

COPY ./packages/server/dist .
COPY ./packages/server/package.json .
COPY ./packages/asset/dist asset

ENV HOST=0.0.0.0
ENV PORT=1234

EXPOSE $PORT

RUN npm i --omit dev

CMD [ "node", "." ]