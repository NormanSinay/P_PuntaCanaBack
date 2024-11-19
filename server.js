const express = require('express');
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Fechas y configuraciones iniciales de las etapas
let etapas = [
  {
    id: 1,
    nombre: "Preparándose para el viaje",
    fechaInicio: new Date(),
    duracion: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  },
  {
    id: 2,
    nombre: "En el vuelo",
    duracion: 12 * 60 * 60 * 1000, // 12 horas en milisegundos
  },
  {
    id: 3,
    nombre: "En el destino: Punta Cana",
    duracion: 48 * 60 * 60 * 1000, // 48 horas en milisegundos
  },
];

// Configurar fechas iniciales de las etapas
function configurarFechas() {
  for (let i = 1; i < etapas.length; i++) {
    etapas[i].fechaInicio = new Date(etapas[i - 1].fechaInicio.getTime() + etapas[i - 1].duracion);
  }
}
configurarFechas();

// Endpoint para obtener las etapas
app.get('/api/etapas', (req, res) => {
  const now = new Date();
  const respuesta = etapas.map((etapa) => {
    const tiempoRestante = etapa.fechaInicio.getTime() - now.getTime();
    return {
      id: etapa.id,
      nombre: etapa.nombre,
      fechaInicio: etapa.fechaInicio.toISOString(),
      tiempoRestante: tiempoRestante > 0 ? tiempoRestante : 0,
    };
  });
  res.json(respuesta);
});

// Endpoint para actualizar etapas manualmente
app.post('/api/etapas', (req, res) => {
  const nuevasEtapas = req.body;

  // Validar los datos enviados
  if (!Array.isArray(nuevasEtapas) || nuevasEtapas.length === 0) {
    return res.status(400).json({ error: 'Debe enviar un arreglo de etapas válido' });
  }

  etapas = nuevasEtapas.map((etapa, index) => {
    return {
      id: index + 1,
      nombre: etapa.nombre || `Etapa ${index + 1}`,
      fechaInicio: etapa.fechaInicio ? new Date(etapa.fechaInicio) : new Date(),
      duracion: etapa.duracion || 0, // Asignar duración predeterminada si no se especifica
    };
  });

  configurarFechas();
  res.json({ message: 'Etapas actualizadas correctamente' });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
