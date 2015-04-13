var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('venues', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    place_id: { type: 'string', unique: true },
    name: {type:'string',unique:true},
    description: 'string',
    category: 'string',
    address: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('venues', callback);
};
