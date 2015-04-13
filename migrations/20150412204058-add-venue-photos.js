var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('venue_photos', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    link: 'string',
    venue_id: { 
      type: 'int', 
      foreignKey: { 
        name: 'venue_photos_venue_id_fk', 
        table: 'venues', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        } 
      } 
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('venue_photos', callback);
};
