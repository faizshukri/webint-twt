var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_retweets', {
    id: { type: 'int', primaryKey: true, autoIncrement: true},
    user_id: { 
      type: 'int',
      primaryKey: true,
      foreignKey: {
        name: 'user_retweets_user_id_fk', 
        table: 'users', 
        mapping: 'id', 
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
  	user_retweet_id: { 
      type: 'int',
      primaryKey: true,
  		foreignKey: { 
        name: 'user_retweets_user_retweet_id_fk', 
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
  db.dropTable('user_retweets', callback);
};