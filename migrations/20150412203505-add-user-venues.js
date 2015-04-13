var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_venues', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { 
      type: 'int',
      primaryKey: true,
      foreignKey: { 
        name: 'user_venue_user_id_fk', 
        table: 'users', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        } 
      } 
    },
    venue_id: {
      type:'int',
      primaryKey: true,
      foreignKey: { 
        name: 'user_venues_venue_id_fk', 
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
  db.dropTable('user_venues', callback);
};