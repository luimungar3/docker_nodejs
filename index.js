var express = require('express');
var app = express();
var path = require('path');  // Para gestionar rutas de archivos

var tareas = ['Tarea 1', 'Tarea 2', 'Tarea 3'];

// Servir el archivo HTML cuando alguien accede a la raíz
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta GET para obtener la lista de tareas
app.get('/tareas', function (req, res) {
  res.json(tareas);
});

// Ruta POST para agregar una tarea
app.post('/tareas', express.json(), function (req, res) {
  const tarea = req.body.tarea;
  if (tarea) {
    tareas.push(tarea);
    res.status(201).send(`Tarea "${tarea}" agregada.`);
  } else {
    res.status(400).send('Falta la descripción de la tarea.');
  }
});

// Iniciar el servidor
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App escuchando en http://%s:%s', host, port);
});
