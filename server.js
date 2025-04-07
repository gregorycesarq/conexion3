
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // sirve el HTML

// Configuración SQL Server (ajusta con tus credenciales)
const dbConfig = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'ColmadoDB',
  options: {
    trustServerCertificate: true
  }
};

// Ruta para insertar artículo
app.post('/api/articulos', async (req, res) => {
  const { nombre, cantidad, precio } = req.body;
  const fechaIngreso = new Date().toISOString().split('T')[0];

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('cantidad', sql.Int, cantidad)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('fechaIngreso', sql.Date, fechaIngreso)
      .query('INSERT INTO Inventario (NombreArticulo, Cantidad, Precio, FechaIngreso) VALUES (@nombre, @cantidad, @precio, @fechaIngreso)');

    res.json({ mensaje: '✅ Artículo insertado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: '❌ Error al insertar el artículo.' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
