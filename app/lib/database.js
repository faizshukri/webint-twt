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
        query += "("+connection.escape(users.screen_name)+","+connection.escape(users.name)+","+connection.escape(users.description)+", "+connection.escape(users.location)+", "+connection.escape(users.profile_image_url)+")";
    }

    connection.query(query, function(err, rows)
    {
        if (err){
            
            console.log(err);

            connection.query("SELECT * FROM users WHERE `twitter_id`="+connection.escape(users.screen_name), function(err, data){
                if(callback){
                    if(data.length > 0) callback(data[0]);
                    else callback({});
                }
            });
        }else{
            //console.log('user is stored');
            if(callback) callback(rows);
        }
    });                         
}
/* store relation between user venues in database*/
database.storeUserVenues = function(user,venue)
{

            var query='INSERT into user_venues (`user_id`,`venue_id`) VALUES("'+user+'","'+venue+'")';
            
            connection.query(query,function(err, rows)
            {
                if (err)
                console.log("err");
                
                //console.log('venue_user is stored');
            });

}
/* store venue details in database*/
database.storeVenues = function(place, gplace, callback){

    if(!place) return;

    var query = "INSERT INTO venues (`place_id`, `name`,`description`,`category`,`address`) VALUES ";

    if(!gplace)
        query += "("+connection.escape(place.id)+","+connection.escape(place.name)+","+connection.escape(place.full_name)+", "+connection.escape(place.place_type)+", "+connection.escape(place.full_name + ', ' + place.country)+")";
    else
        query += "("+connection.escape(place.id)+","+connection.escape(place.name)+","+connection.escape(place.full_name)+", "+connection.escape(place.place_type)+", "+connection.escape(gplace.name + ', ' + gplace.formatted_address)+")";

    connection.query(query, function(err, rows){
        if (err){
            connection.query("SELECT * FROM venues WHERE `place_id`="+connection.escape(place.id), function(err, data){
                console.log(err);
                if(callback){
                    if(data.length > 0) callback(data[0]);
                    else callback({});
                }
            });
        }else{
            if(callback) callback(rows);
        }
    });

}


/*store the users a user has contacted*/
database.storeUserConnection=function(original,contact)
{
    var query = 'insert into user_retweets(id,user_retweet_id) values ("'+original+'""'+contact+'")';
    connection.query(query,function(err, rows)
    {
        if (err)
            console.log("err");
        
    });
}
/*store tweets in database*/
database.storeTweets = function(tweets){

    var start = "INSERT INTO tweets (`text`,`user_id`,`retweeted`,`retweeted_user_id`,`venue_id`) VALUES ";
    
    // If user pass array of user
    if(tweets instanceof Array){
        var values = [];
        var count = 0;
        tweets.forEach(function(tweet, index){
            count++;
            database.storeUser(tweet.user, function(data){
                var user_id = data.insertId || data.id;

                database.storeVenues(tweet.place, tweet.gplace, function(data){
                    
                    var venue_id = data.insertId || data.id;
                    var retweeted = tweet.retweeted_status ? 1 : 0;
                    var retweeted_user_id = retweeted ? tweet.retweeted_status.user.id_str : null;

                    query = start + "("+connection.escape(tweet.text)+","+connection.escape(user_id)+", "+connection.escape(retweeted)+", "+connection.escape(retweeted_user_id)+","+connection.escape(venue_id)+")"
                    startQuery(query);
                    database.storeUserVenues(user_id,venue_id);
                });
            });
        });
        
    // users is a User object only 
    } else {
        var tweet = tweets;
        database.storeUser(tweet.user, function(data){
            var user_id = data.insertId || data.id;

            database.storeVenues(tweet.place, tweet.gplace, function(data){
                
                var venue_id = data.insertId || data.id;
                var retweeted = tweet.retweeted_status ? 1 : 0;
                var retweeted_user_id = retweeted ? tweet.retweeted_status.user.id_str : null;

                query = start + "("+connection.escape(tweet.text)+","+connection.escape(user_id)+", "+connection.escape(retweeted)+", "+connection.escape(retweeted_user_id)+","+connection.escape(venue_id)+")"
                startQuery(query);
                database.storeUserVenues(user_id,venue_id);
            });
        });
    }
    
}

/*get id of a particular venue from database*/
database.getVenueID=function(Venue,callback)
{
    connection.query('select id from venues where place_id ="'+Venue+'"',function(err,rows)
    {
        if(err)
            console.log(err)

        if(callback) callback(rows);

    } )
}
/*get id of a particular user from databse given the twitterID*/
database.getUserID= function (user, callback)
{
    connection.query('select id from users where twitter_id = "'+user+'"',function(err, rows)
     {
        if(err)
            console.log(err)

        if(callback) callback(rows);
       } );    
           
}
/* store relation between user and keywords*/
database.storeUserKeyword= function(keyword,user,frequncy)
{

    database.getUserID(user, function(data){
    	 connection.query('insert into user_keywords (user_id,keyword_id,frequency) values("'+ data[0].id+'","'+keyword+'","'+frequncy+'")', function(err, rows)
         {
             if(err)
                 console.log(err)
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
    var query= 'select twitter_id from users where twitter_id LIKE "' + usr+ '%"'
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
        
        console.log("m here");
       /*get id of venue from database*/ 
    database.getVenueID(venue,function(data)
    {
        var venue_id=data[0];
        
        var query= 'select user_id from user_venues join venues on (user_venues.venue_id = venues.id)where name = "'+venue+'"'
    
   /*get user id's of the users who have visited the venue*/
    connection.query('select user_id from user_venues join venues on (user_venues.venue_id = venues.id)where name = "'+venue+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        screen_name=rows;
         var user_details=[]

      /*get details for each user who have visited the venue*/
       screen_name.forEach(function(user)
    {   
        
                connection.query('select * from users where users.id="'+user.user_id+'"',function(err, rows)
                    {
                        if (err)
                            console.log(err)
                        else
                        {
                            user_details.push({'name':rows[0].name,'id':rows[0].twitter_id})
                            

                        }
                        if (user_details.length==screen_name.length)
                     {

                        
                        callback(user_details)
                     } 
                        
                     })                  
        
    })
            
    });
    
    
    })
       
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
                                console.log(err);
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
    /*when all information needed is retrieved, callback function is called*/
	function counting()
	{
		count=count+1
		if (count==3)
		{
            
			callback(user_table,venues,user_contacted)
		}
	}
    /*get user details from database*/
    connection.query('select * from users where users.twitter_id="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		user_table=rows;
    	counting()
    });
    database.getUserID(user, function(data){
    var query1='select venues.name from venues join user_venues on (user_venues.venue_id=venues.id) where user_venues.user_id="'+data[0].id+'"'
    /*get the venues user has visited*/
    connection.query('select venues.name from venues join user_venues on (user_venues.venue_id=venues.id) where user_venues.user_id="'+data[0].id+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		//console.log(rows)
    		venues=rows;
    	counting()
    });
});
    /*get the users the user has contacted if any*/
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
/* function to store stopwords in database when the system is intalled for the first time*/
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
/*general function to excecute queries*/
function startQuery(query){
    connection.query(query, function(err, rows)
    {
        if (err)
            console.log(err);
        else
            console.log('tweets is stored');
    });
}

module.exports = database;