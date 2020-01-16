FROM node

EXPOSE 8080 5432

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

USER node

RUN cd /home/node/app/client && npm i && npm run build
RUN cd /home/node/app/server && npm i && npm run build

WORKDIR /home/node/app/server

CMD ["npm", "start"]

# docker run --name personal-finance-tracker --net=host -v /absolute/path/to/.env:/home/node/app/server/.env --restart unless-stopped -d rbarbazz/personal-finance-tracker
