var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('stopwords', {
    words: { type: 'string', primaryKey: true}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('topwords', callback);
};