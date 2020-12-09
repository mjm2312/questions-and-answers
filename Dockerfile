FROM node:12

#makes src in container
RUN mkdir -p /src
WORKDIR /src
COPY . .
#WORKDIR /src
COPY package*.json ./
RUN npm install 
# COPY . .

EXPOSE 3001
RUN npm install -g nodemon
CMD [ "nodemon", "src/app.js" ]