const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json()); // Para manejar JSON en solicitudes POST

// Archivo para almacenar la fecha de inicio
const FILE_PATH = path.join(__dirname, 'fecha-inicio.json');

// Función para cargar la fecha de inicio desde el archivo
function cargarFechaInicio() {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return new Date(JSON.parse(data).fechaInicio);
  }
  return null;
}

// Función para guardar la fecha de inicio en el archivo
function guardarFechaInicio(fecha) {
  const data = { fechaInicio: fecha.toISOString() };
  fs.writeFileSync(FILE_PATH, JSON.stringify(data), 'utf-8');
}

// Cargar o establecer una fecha inicial predeterminada
let fechaInicio = cargarFechaInicio();
if (!fechaInicio) {
  fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() + 1); // Predeterminado: 1 día después de ahora
  guardarFechaInicio(fechaInicio);
}

// Endpoint para obtener la fecha de inicio
app.get('/api/fecha-inicio', (req, res) => {
  res.json({ fechaInicio: fechaInicio.toISOString() });
});

// Endpoint para actualizar la fecha de inicio
app.post('/api/fecha-inicio', (req, res) => {
  const { nuevaFecha } = req.body;
  if (!nuevaFecha) {
    return res.status(400).json({ error: 'Se requiere la nueva fecha.' });
  }

  const nuevaFechaInicio = new Date(nuevaFecha);
  if (isNaN(nuevaFechaInicio.getTime())) {
    return res.status(400).json({ error: 'La fecha proporcionada no es válida.' });
  }

  fechaInicio = nuevaFechaInicio;
  guardarFechaInicio(fechaInicio);
  res.json({ mensaje: 'Fecha de inicio actualizada correctamente.', fechaInicio: fechaInicio.toISOString() });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
