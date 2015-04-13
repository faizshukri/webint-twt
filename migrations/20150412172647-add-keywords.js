var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('keywords', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    keyword: {type:'string', unique:true}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('keywords', callback);
};