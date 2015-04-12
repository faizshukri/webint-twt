var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('tweets', {
    id: { type: 'int', primaryKey: true },
    text: 'string',
    user_id: { 
        type: 'int', 
        foreignKey: { 
            name: 'tweets_user_id_fk', 
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
  db.dropTable('tweets', callback);
};
