FROM node:20-alpine

COPY dist .
COPY package.json .
COPY asset asset

ENV HOST=0.0.0.0
ENV PORT=1234

EXPOSE $PORT

RUN npm i --omit dev

CMD [ "node", "." ]