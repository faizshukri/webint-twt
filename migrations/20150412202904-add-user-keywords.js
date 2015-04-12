var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('user_keywords', {
    user_id: { type: 'string', primaryKey: true,
			foreignKey: { 
            name: 'user_keywords_fk', 
            table: 'users', 
            mapping: 'id', 
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            } },
    keyword_id: {type:'int', primaryKey:true,
				foreignKey: { 
	            name: 'keyword_user_fk', 
	            table: 'keywords', 
	            mapping: 'id', 
	            rules: {
	                onDelete: 'CASCADE',
	                onUpdate: 'RESTRICT'
            } },
    frequency:'int',
    since_days:'int'
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('user_keywords', callback);
};