FROM node:12

RUN mkdir -p /src
#had COPY . . but issue w kubernetes: https://stackoverflow.com/questions/61729187/cannot-find-module-usr-src-app-server-js
COPY /src /src
WORKDIR /src

COPY package*.json ./
RUN npm install 

EXPOSE 3001
#CMD [ "nodemon", "src/app.js" ] nodemon may be causing error w kubernetes
WORKDIR /
CMD ["node", "src/app.js"]