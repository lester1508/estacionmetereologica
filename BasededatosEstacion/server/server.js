const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./ruta/a/tu/clave/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia esto por tu usuario de MySQL
  password: '', // Cambia esto por tu contraseña de MySQL
  database: 'estacion_metereologica',
  port: 3307,
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

const app = express();
app.use(bodyParser.json());

// Endpoint para recibir datos de Firebase
app.post('/api/datos', (req, res) => {
  const { velocidadViento, cantidadLluvia, fecha } = req.body;

  // Consulta para insertar datos en MySQL
  const query = 'INSERT INTO tu_tabla (velocidad_viento, cantidad_lluvia, fecha) VALUES (?, ?, ?)';
  db.query(query, [velocidadViento, cantidadLluvia, fecha], (err, result) => {
    if (err) {
      console.error('Error al insertar datos:', err);
      return res.status(500).send('Error al insertar datos');
    }
    res.status(200).send('Datos insertados correctamente');
  });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
