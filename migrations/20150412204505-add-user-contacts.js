var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_contacts', {
    originalUser: { type: 'string', primaryKey: true,
			foreignKey: { 
            name: 'user_keywords_fk', 
            table: 'users', 
            mapping: 'id', 
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            } },
	contactedUser: { type: 'string', primaryKey: true,
				foreignKey: { 
	            name: 'user_keywords_fk', 
	            table: 'users', 
	            mapping: 'id', 
	            rules: {
	                onDelete: 'CASCADE',
	                onUpdate: 'RESTRICT'
	            } }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_contacts', callback);
};