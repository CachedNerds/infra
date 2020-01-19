FROM node:lts

WORKDIR /opt/app

COPY ./package.json ./package.json
RUN npm install

COPY ./index.js ./index.js

EXPOSE 8080

ENTRYPOINT ["node", "index.js"]
