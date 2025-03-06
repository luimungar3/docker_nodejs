var express = require('express');
var os = require('os');
var path = require('path');
var docker = require('dockerode');
const { exec } = require('child_process');
var app = express();

// Conexión a Docker
var client = new docker();

// Servir archivos estáticos
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

// Ruta para obtener los contenedores
app.get('/containers', async (req, res) => {
    try {
        const containers = await client.listContainers({ all: true });
        const containerInfo = containers.map(container => ({
            id: container.Id,
            name: container.Names[0].substring(1), // Eliminar el prefijo '/'
            status: container.State
        }));
        res.json({ containers: containerInfo });
    } catch (err) {
        res.status(500).send(err);
    }
});


// Endpoint para obtener el estado del contenedor
app.use(express.static('public')); // Para servir archivos estáticos como monitoreo.html

app.get('/container-status', (req, res) => {
    exec("docker ps -a --format '{{json .}}'", (error, stdout, stderr) => {
        if (error) {
            return res.json({ status: "error", message: error.message });
        }
        if (stderr) {
            return res.json({ status: "error", message: stderr });
        }

        const containers = stdout.trim().split("\n").map(line => JSON.parse(line));
        res.json({ status: "success", containers });
    });
});

// Ruta para controlar contenedores
app.post('/control-container/:id/:action', async (req, res) => {
    const { id, action } = req.params;
    try {
        const container = client.getContainer(id);
        if (action === 'start') {
            await container.start();
        } else if (action === 'stop') {
            await container.stop();
        } else if (action === 'restart') {
            await container.restart();
        }
        res.send('Acción ejecutada con éxito');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Iniciar el servidor en el puerto 3001
app.listen(3001, '0.0.0.0', function () {
    console.log('Servidor corriendo en http://0.0.0.0:3001');
});
