const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3308,          // 👈 tu puerto
  user: 'root',
  password: '', 
  database: 'mercado_vecino_v3'
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar:', err);
    return;
  }
  console.log('✅ Conexión exitosa a MySQL en el puerto 3308');
});

// 🔹 PRUEBA: hacer una consulta rápida
db.query('SELECT 1 + 1 AS resultado', (err, results) => {
  if (err) {
    console.error('❌ Error en la consulta:', err);
    return;
  }
  console.log('👉 Resultado de prueba:', results[0].resultado);
});

// Exportar conexión
module.exports = db;

