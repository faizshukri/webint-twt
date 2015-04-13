var connection = require('../services/db');
var database = {};
/* store user details in database in the USERS table*/
database.storeUser= function (data)
{
    var query = 'insert into Users (id,name,description,location,photo) values("'+ data.screen_name+'""'+data.name+'""'+data.description+'""'+data.location+'""'+data.profile_image_url+'")';
    connection.query('insert into Users (id,name,description,location,photo) values("'+ data.screen_name+'","'+data.name+'","'+data.description+'","'+data.location+'","'+data.profile_image_url+'")', function(err, rows)
    {
        if (err)
            console.log("duplicate entry");
    });                         
}
/* store relation between user and keywords*/
database.storeUserKeyword= function(keyword,user,frequncy)
{

	connection.query('insert into user_keywords (user_id,keyword_id,frequency) values("'+ user+'","'+keyword+'","'+frequncy+'")', function(err, rows)
                         {
                            if(err)
                                console.log("duplicate entry")
                       	 });                     
}
/* Get id of keyword from database*/
database.getKeywordID = function(keyword,user,frequency,callback)
    {
    var query= 'select id from keywords where keyword = "'+keyword+'"';
    connection.query('select id from keywords where keyword = "'+keyword+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        callback(rows[0].id,user,frequency)
    });
   
    }
/* Get users id's from database*/
database.getUsernames = function(usr,callback)
    {
    var query= 'select id from Users where id LIKE "' + usr+ '%"'
                                + 'OR id LIKE "% ' +usr+ '%"';
    connection.query(query,function(err, rows)
    {
        if (err)
            console.log(err)
        callback(rows)
    });
   
    }
/* Get users who visited a particular venue from database*/
  database.userByVenues = function(venue,callback)
    {
    var query= 'select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"';
    connection.query('select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        callback(rows);
        //console.log(rows);
    });
   
    }
/* GET venue names from database*/
database.getVenues = function(venue,callback)
    {
    
    connection.query('select * from venues where name LIKE "' + venue+ '%"'
                                + 'OR name LIKE "% ' +venue+ '%"',function(err, rows)
    {
        if (err)
            console.log(err)
        callback(rows);
        //console.log(rows);
    });
   
    }
/*store keywords used by any user in the database*/
database.storeKeywords= function (user,keyword,frequency,callback,nextcallback)
{
    connection.query('insert into keywords (keyword) values("'+ keyword+'")', function(err, rows)
                         {
                            if (err)
                                console.log("duplicate entry");
                            callback(keyword,user,frequency,nextcallback);
                        });
   
}
/* GET details of a particular user from databse including the venues visited and users contacted from database */
database.getUserDetails = function(user,callback)
{
	var user_table=[];
	var user_contacted=[];
	var venues=[];
	var count=0;

	function counting()
	{
		count=count+1
		if (count==3)
		{
			callback(user_table,venues,user_contacted)
		}
	}

    connection.query('select * from Users where Users.id="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		user_table=rows;
    	counting()
    });

    connection.query('select venues.name from venues join user_venues on (user_venues.venue_id=venues.venue_id) where user_venues.user_id="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		venues=rows;
    	counting()
    });

     connection.query('select * from user_contacts where originalUser="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		user_contacted=rows;
    	counting()
    });
}

database.initializeStopwords = function(callback){
    var keywords = [ 'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'it', 'its', 'its', 'itself', 'lets', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'shed', 'shell', 'shes', 'should', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'wed', 'well', 'were', 'weve', 'were', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves' ];
    
    var query = "INSERT INTO `stopwords` (`id`, `words`) VALUES ";
    var values = [];
    keywords.forEach(function(keyword, index){
        values.push("(" + (index + 1) + ",'"+keyword+"')");
    });
    query += values.join(', ');

    connection.query(query,function(err, rows)
    {
        if (err){
            console.log(err)
        } else {
            callback();
            connection.end();
        }
    });
    
}

module.exports = database;