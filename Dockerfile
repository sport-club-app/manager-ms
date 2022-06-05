FROM node:14-slim


SHELL [ "/bin/bash", "-c" ]

USER node

WORKDIR /home/node/app

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

RUN npm run build


ENV HOST=localhost
ENV APP_HOST=http://localhost
ENV APP_PORT=3003
ENV NODE_ENV=production

RUN chmod +x .docker/entrypoint.sh
ENTRYPOINT .docker/entrypoint.sh

EXPOSE 3003

CMD npm start