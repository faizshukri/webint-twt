/**
*   Database mysql object
*/

var mysql = require('mysql');
var db_config = typeof(config) != 'undefined' ? config.database : require('../../database.json')['dev'];

var connection = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  database : db_config.database
});

connection.connect();

module.exports = connection;