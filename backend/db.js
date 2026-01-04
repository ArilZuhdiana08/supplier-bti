const mysql = require('mysql2');
const config = require('./config');

const db = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: config.database.waitForConnections,
  connectionLimit: config.database.connectionLimit,
  queueLimit: config.database.queueLimit
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    // Retry connection after 5 seconds
    setTimeout(() => {
      db.connect();
    }, 5000);
  } else {
    console.log('✓ Database connected successfully');
  }
});

// Handle connection errors
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    db.connect();
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    db.connect();
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Database access denied - check credentials');
  }
});

module.exports = db;
