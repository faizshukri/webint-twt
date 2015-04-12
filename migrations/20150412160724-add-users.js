var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true },
    name: 'string',
    description: 'string',
    photo: 'string',
    location: 'string'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
