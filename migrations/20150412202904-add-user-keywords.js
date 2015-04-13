var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_keywords', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { 
      type: 'int',
      primaryKey: true,
      foreignKey: { 
        name: 'user_keywords_user_id_fk', 
        table: 'users', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        } 
      } 
    },
    keyword_id: {
      type:'int',
      primaryKey: true,
      foreignKey: { 
        name: 'user_keywords_keyword_id_fk', 
        table: 'keywords', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        } 
      } 
    },
    frequency: 'int',
    since_days: 'datetime'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_keywords', callback);
};