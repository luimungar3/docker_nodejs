var express = require('express');
var os = require('os');
var path = require('path');
var { exec } = require('child_process'); // Importamos exec para ejecutar comandos de shell
var app = express();

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

// Ruta para obtener información de los contenedores
app.get('/containers', function (req, res) {
    exec('docker ps --format "{{.ID}} {{.Names}} {{.Image}} {{.Status}}"', (err, stdout, stderr) => {
        if (err) {
            console.error('Error al obtener contenedores:', err);
            return res.status(500).json({ error: 'Error al obtener contenedores' });
        }

        // Dividimos la salida del comando en líneas para obtener cada contenedor
        const containers = stdout.split('\n').filter(line => line).map(line => {
            const [id, name, image, status] = line.split(' ');
            return { id, name, image, status };
        });

        res.json(containers); // Devolver contenedores en formato JSON
    });
});

// Ruta para apagar el servidor (Usar POST en vez de GET)
app.post('/shutdown', function (req, res) {
    res.send('El servidor se está apagando...');
    setTimeout(() => process.exit(0), 3000);
});

// Iniciar el servidor en el puerto 3001
app.listen(3001, '0.0.0.0', function () {
    console.log('Servidor corriendo en http://0.0.0.0:3001');
});
