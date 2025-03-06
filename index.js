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
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = 'No disponible';

    for (const iface of Object.values(networkInterfaces)) {
        for (const entry of iface) {
            if (entry.family === 'IPv4' && !entry.internal) {
                ipAddress = entry.address;
                break;
            }
        }
    }

    res.json({
        system: os.type(),
        version: os.release(),
        architecture: os.arch(),
        cpus: os.cpus().length,
        hostname: os.hostname(),
        freeMemory: (os.freemem() / 1024 / 1024).toFixed(2) + " MB",
        totalMemory: (os.totalmem() / 1024 / 1024).toFixed(2) + " MB",
        uptime: os.uptime() + " segundos",
        homeDirectory: os.homedir(),
        ipAddress: ipAddress
    });
});


// Iniciar el servidor en el puerto 3001
app.listen(3001, '0.0.0.0', function () {
    console.log('Servidor corriendo en http://0.0.0.0:3001');
});
