const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'toor',
  database: 'tin-projekt',
  multipleStatements: true,
  charset: 'utf8'
});

module.exports = pool.promise();
