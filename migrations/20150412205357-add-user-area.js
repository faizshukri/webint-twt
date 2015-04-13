var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_areas', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    user_id: { 
      type: 'int',
      primaryKey: true,
			foreignKey: { 
        name: 'user_areas_user_id_fk', 
        table: 'users', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
    area_id: {
      type:'int',
      primaryKey: true,
			foreignKey: { 
        name: 'user_areas_area_id_fk', 
        table: 'geographic_area', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_areas', callback);
};