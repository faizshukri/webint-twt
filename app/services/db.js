/**
*   Database mysql object
*/

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.database
});

connection.connect();

module.exports = connection;