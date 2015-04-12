var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('geographic_area', {
    id: { type: 'int', primaryKey: true,autoIncrement: true },
    name: {type:'string'},
    x_coordinate: 'float',
    y_coordinate: 'float'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('geographic_area', callback);
};
