var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World! Hola Mundo!');
});

var tareas = ['Tarea 1', 'Tarea 2', 'Tarea 3'];

app.get('/tareas', function (req, res) {
  res.json(tareas);
});

// Ruta para agregar una tarea
app.post('/tareas', express.json(), function (req, res) {
  const tarea = req.body.tarea;
  if (tarea) {
    tareas.push(tarea);
    res.status(201).send(`Tarea "${tarea}" agregada.`);
  } else {
    res.status(400).send('Falta la descripción de la tarea.');
  }
});

// Aquí aseguramos que la app escuche en 0.0.0.0 para que sea accesible desde fuera del contenedor
var server = app.listen(3000, '0.0.0.0', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App escuchando en http://%s:%s', host, port);
});
