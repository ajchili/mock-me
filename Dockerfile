FROM node:20-alpine


COPY ./packages/server/dist .
COPY ./packages/server/package.json .
COPY ./packages/asset/dist asset

ENV HOST=0.0.0.0
ENV PORT=1234
ENV LEETCODE_API_ENDPOINT=https://alfa-leetcode-api.onrender.com

EXPOSE $PORT

RUN npm i --omit dev

CMD [ "node", "." ]