var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_contacts', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    originalUser: { 
      type: 'string',
      foreignKey: {
        name: 'user_keywords_fk', 
        table: 'users', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
  	contactedUser: { 
      type: 'string',
  		foreignKey: { 
        name: 'user_keywords_fk', 
        table: 'users', 
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
  db.dropTable('user_contacts', callback);
};