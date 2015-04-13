var connection = require('../services/db');
var database = {};
/* store user details in database in the USERS table*/
database.storeUser= function (users, callback)
{
    var query = "INSERT INTO users (`twitter_id`, `name`,`description`,`location`,`photo`) VALUES ";
    
    // If user pass array of user
    if(users instanceof Array){
        var values = [];
        users.forEach(function(user){
            values.push( "("+connection.escape(user.screen_name)+","+connection.escape(user.name)+","+connection.escape(user.description)+", "+connection.escape(user.location)+", "+connection.escape(user.profile_image_url)+")" );
        });
        query += values.join(', ');
    // users is a User object only 
    } else {
        //console.log(users.entities.screen_name);
        query += "("+connection.escape(users.screen_name)+","+connection.escape(users.name)+","+connection.escape(users.description)+", "+connection.escape(users.location)+", "+connection.escape(users.profile_image_url)+")";
    }

    connection.query(query, function(err, rows)
    {
        if (err){
            //throw err;
            console.log("user is already stored");
        }else{
            console.log('user is stored');
            if(callback) callback(rows);
        }

    });                         
}

database.storeVenues = function(place, gplace){

    if(!place || !gplace) return;

    var query = "INSERT INTO venues (`name`,`description`,`category`,`address`) VALUES "+
                "('"+connection.escape(place.name)+"','"+connection.escape(place.full_name)+"', '"+connection.escape(place.place_type)+"', '"+connection.escape(gplace.name)+", "+connection.escape(gplace.formatted_address)+"')";

    connection.query(query, function(err, rows){

    });

}

database.storeUserConnection=function(original,contact)
{
    var query = 'insert into user_retweets(id,user_retweet_id) values ("'+original+'""'+contact+'")';
    connection.query(query,function(err, rows)
    {
        if (err)
            console.log("duplicate entry");
        else
            console.log('venue is stored');
    });
}

database.storeTweets = function(tweets){

    console.log('try to store tweets');

    var start = "INSERT INTO tweets (`text`,`user_id`,`retweeted`,`retweeted_user_id`) VALUES ";
    
    // If user pass array of user
    if(tweets instanceof Array){
        var values = [];
        var count = 0;
        tweets.forEach(function(tweet, index){
            count++;
            database.storeUser(tweet.user, function(data){
                var retweeted = tweet.retweeted_status ? 1 : 0;
                var retweeted_user_id = retweeted ? tweet.retweeted_status.user.id_str : "";
                console.log(data.insertId);
                // values.push( "("+connection.escape(tweet.text)+","+connection.escape(data.insertId)+", "+connection.escape(retweeted)+", "+connection.escape(retweeted_user_id)+")" );
                
                query = start + "("+connection.escape(tweet.text)+","+connection.escape(data.insertId)+", "+connection.escape(retweeted)+", "+connection.escape(retweeted_user_id)+")"
                // if(count === tweets.length){
                    query += values.join(', ');
                    console.log('array tweets');
                    startQuery(query);
                // }
            });
        });
        
    // users is a User object only 
    } else {
        database.storeUser(tweet.user, function(data){
            var retweeted = tweets.retweeted_status ? 1 : 0;
            var retweeted_user_id = retweeted ? tweets.retweeted_status.user.id_str : "";
            console.log(data.insertId);
            query += "("+connection.escape(tweets.text)+","+connection.escape(data.insertId)+", "+connection.escape(retweeted)+", "+connection.escape(retweeted_user_id)+")";
            console.log('object tweet');
            startQuery(query);
        });
    }
    
}

/* store user details in database in the USERS table*/
/*database.storeUser= function (data)
{
    var query = 'insert into Users (twitter_id,,name,description,location,photo) values("'+ data.screen_name+'""'+data.name+'""'+data.description+'""'+data.location+'""'+data.profile_image_url+'")';
    connection.query('insert into Users (twitter_id,name,description,location,photo) values("'+ data.screen_name+'","'+data.name+'","'+data.description+'","'+data.location+'","'+data.profile_image_url+'")', function(err, rows)
    {
        if (err)
            console.log("users insertion "+err);
    });   
    //console.log(data.user_mentions.length); 
    //database.storeUserConnection(day)                     
}*/

/* store relation between user and keywords*/

database.getUserID= function (user, callback)
{
    connection.query('select id from Users where twitter_id = "'+user+'"',function(err, rows)
     {
        if(err)
            console.log(err)

        if(callback) callback(rows);
       } );    
           
}
database.storeUserKeyword= function(keyword,user,frequncy)
{

    database.getUserID(user, function(data){
        //console.log(data[0].id);
    	 connection.query('insert into user_keywords (user_id,keyword_id,frequency) values("'+ data[0].id+'","'+keyword+'","'+frequncy+'")', function(err, rows)
         {
             if(err)
                 console.log("relation already stored")
        	 });                     
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
    var query= 'select twitter_id from Users where twitter_id LIKE "' + usr+ '%"'
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
        var screen_name=[];
    var query= 'select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"';
    connection.query('select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        screen_name=rows;
        //callback(rows);
        //console.log(rows);
    });
    screen_name.forEach(function(user,callback)
    {
            database.getUserID(user,function(user){
                connection.query('select * from Users where Users.id="'+user.id+'"',function(err, rows)
                    {
                        if (err)
                            console.log(err)
                        console.log(rows);
                     });   
            });
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
                                console.log("keyword already stored");
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
            console.log(user_contacted,venues,user_table)
			callback(user_table,venues,user_contacted)
		}
	}

    connection.query('select * from Users where Users.twitter_id="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		user_table=rows;
    	counting()
    });

    connection.query('select venues.name from venues join user_venues on (user_venues.venue_id=venues.id) where user_venues.user_id="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		venues=rows;
    	counting()
    });

     connection.query('select * from user_retweets where user_id="'+user+'"',function(err, rows)
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
    var keywords = [ 'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'it', 'its', 'its', 'itself', 'lets', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'shed', 'shell', 'shes', 'should', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'wed', 'well', 'were', 'weve', 'were', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves',"\n","" ];
    
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

function startQuery(query){
    console.log('the query: ', query);
    connection.query(query, function(err, rows)
    {
        if (err)
            console.log(err);
        else
            console.log('tweets is stored');
    });
}

module.exports = database;