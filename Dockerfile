# Usamos una imagen más reciente de Node.js (por ejemplo, la 16)
FROM node:16

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /appnodejs

# Copiamos todos los archivos del proyecto al contenedor
ADD . /appnodejs

# Instalamos las dependencias del proyecto
RUN npm install

# Exponemos el puerto 3000 para poder acceder a la app desde fuera del contenedor
EXPOSE 3000

# Definimos el comando que se ejecutará cuando el contenedor inicie
CMD ["npm", "start"]
