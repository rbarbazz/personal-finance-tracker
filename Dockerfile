FROM node

EXPOSE 8080

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

USER node

RUN cd /home/node/app/client && npm i && npm run build
RUN cd /home/node/app/server && npm i && npm run build

WORKDIR /home/node/app/server

VOLUME server/.env /home/node/app/server/.env
CMD ["npm", "start"]
