var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : config.app.mysql.host,
  user     : config.app.mysql.user,
  password : config.app.mysql.password,
  database : config.app.mysql.database
});

connection.connect();

module.exports = connection;