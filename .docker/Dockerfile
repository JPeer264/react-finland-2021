FROM node:14

WORKDIR /app

COPY package* ./

RUN npm i

ARG DIRECTORY

COPY services/$DIRECTORY ./

CMD ["node", "index.js"]
