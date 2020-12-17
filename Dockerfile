FROM node:12

#makes src in container
RUN mkdir -p /src
#WORKDIR /src
#had COPY . . but issue w kubernetes: https://stackoverflow.com/questions/61729187/cannot-find-module-usr-src-app-server-js
COPY /src /src
WORKDIR /src
#WORKDIR /src
COPY package*.json ./
RUN npm install 
# COPY . .
#RUN nmp start

EXPOSE 3001
#RUN npm install -g nodemon nodemon may bec ausing error w kubernetes
#CMD [ "nodemon", "src/app.js" ] nodemon may be causing error w kubernetes
#CMD ["node", "app.js"]
WORKDIR /
CMD ["node", "src/app.js"]