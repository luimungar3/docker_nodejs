var express = require('express');
var os = require('os');
var path = require('path');
var app = express();

// Servir archivos estáticos (para el index.html)
app.use(express.static(path.join(__dirname)));

// Ruta para mostrar el HTML
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para obtener información del sistema
app.get('/info', function (req, res) {
    res.json({
        system: os.type(),
        architecture: os.arch(),
        cpus: os.cpus().length,
        freeMemory: (os.freemem() / 1024 / 1024).toFixed(2), // Convertir a MB
        totalMemory: (os.totalmem() / 1024 / 1024).toFixed(2), // Convertir a MB
        uptime: os.uptime() // Tiempo en segundos
    });
});

// Iniciar el servidor en el puerto 3001
app.listen(3001, '0.0.0.0', function () {
    console.log('Servidor corriendo en http://0.0.0.0:3001');
});
