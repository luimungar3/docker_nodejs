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
