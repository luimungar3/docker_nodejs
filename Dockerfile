FROM node:12
WORKDIR /appnodejs2
ADD . /appnodejs2
RUN npm install
EXPOSE 3000
CMD npm start
