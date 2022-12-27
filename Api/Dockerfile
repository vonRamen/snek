FROM node:12-alpine

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
# copy source code to /app/src folder
COPY . .

RUN npm install

CMD [ "node", "./app.js" ]