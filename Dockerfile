FROM node

EXPOSE 8080

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

USER node

RUN cd /home/node/app/client && npm i && npm run build
RUN cd /home/node/app/server && npm i && npm run build

WORKDIR /home/node/app/server

CMD ["npm", "start"]

# docker run --name personal-finance-tracker -p 80:8080 -v /home/$USER/personal-finance-tracker/server/.env:/home/node/app/server/.env -d personal-finance-tracker