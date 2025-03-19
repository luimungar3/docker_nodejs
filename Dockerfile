FROM node:16

WORKDIR /appnodejs

# Copiamos todos los archivos del proyecto al contenedor
ADD . /appnodejs

# Instalamos las dependencias del proyecto
RUN npm install

EXPOSE 3001

CMD ["npm", "start"]
