FROM node:14-alpine
WORKDIR /usr/src/app

COPY . ./
COPY .env.example .env
RUN npm install

ENV WEB_BASE_HOST=0.0.0.0
ENV WEB_BASE_PORT=3000

RUN npm run build

EXPOSE 3000

#COPY ./docker/env/.env.local .env

CMD [ "yarn", "start" ]
