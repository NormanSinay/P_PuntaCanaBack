const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json()); // Necesario para procesar JSON enviado desde el cliente

// Variable para almacenar la fecha de inicio (por defecto, un día después de hoy)
let fechaInicio = new Date();
fechaInicio.setDate(fechaInicio.getDate() + 1);

// Endpoint para obtener la fecha de inicio
app.get('/api/fecha-inicio', (req, res) => {
  res.json({ fechaInicio: fechaInicio.toISOString() });
});

// Endpoint para configurar manualmente la fecha de inicio
app.post('/api/fecha-inicio', (req, res) => {
  const { nuevaFecha } = req.body;

  // Validar que la fecha sea válida
  if (!nuevaFecha || isNaN(new Date(nuevaFecha).getTime())) {
    return res.status(400).json({ error: 'Fecha inválida' });
  }

  // Actualizar la fecha de inicio
  fechaInicio = new Date(nuevaFecha);
  res.json({ message: 'Fecha de inicio actualizada', fechaInicio: fechaInicio.toISOString() });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
