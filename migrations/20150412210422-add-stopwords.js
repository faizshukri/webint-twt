var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;


exports.up = function(db, callback) {
  db.createTable('stopwords', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    words: { type: 'string' }
  }, function(err){
    var database = require('../app/lib/database');
    database.initializeStopwords(function(){
        console.log('Stopwords initialized');
        return callback();
    });
  });
};

exports.down = function(db, callback) {
  db.dropTable('stopwords', callback);
};