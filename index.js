const express = require('express');
const os = require('os');

const app = express();
const PORT = 3001;

// Función para obtener información del sistema operativo
function getSystemInfo() {
    return {
        hostname: os.hostname(),
        platform: os.platform(),
        architecture: os.arch(),
        cpuCores: os.cpus().length,
        cpuModel: os.cpus()[0].model,
        totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`,
        freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`,
        uptime: `${(os.uptime() / 3600).toFixed(2)} horas`
    };
}

// Ruta principal
app.get('/', (req, res) => {
    res.send('<h1>Información del Sistema</h1><p>Visita <a href="/sistema">/sistema</a> para ver los detalles.</p>');
});

// Ruta para mostrar información del sistema operativo en formato JSON
app.get('/sistema', (req, res) => {
    res.json(getSystemInfo());
});

// Iniciar el servidor en 0.0.0.0 para que sea accesible desde fuera del contenedor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

