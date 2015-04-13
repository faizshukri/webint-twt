var connection = require('../services/db');
var database = {};

database.storeUser= function (data)
{
    var query = 'insert into Users (id,name,description,location,photo) values("'+ data.screen_name+'""'+data.name+'""'+data.description+'""'+data.location+'""'+data.profile_image_url+'")';
    connection.query('insert into Users (id,name,description,location,photo) values("'+ data.screen_name+'","'+data.name+'","'+data.description+'","'+data.location+'","'+data.profile_image_url+'")', function(err, rows)
    {
        if (err)
            console.log("duplicate entry");
    });                         
}
database.storeUserKeyword= function(keyword,user,frequncy)
{

	connection.query('insert into user_keywords (user_id,keyword_id,frequency) values("'+ user+'","'+keyword+'","'+frequncy+'")', function(err, rows)
                         {
                            if(err)
                                console.log("duplicate entry")
                       	 });                     
}

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

  database.userByVenues = function(venue,callback)
    {
        console.log("m here")
    var query= 'select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"';
    connection.query('select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        callback(rows);
        //console.log(rows);
    });
   
    }

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

database.storeKeywords= function (user,keyword,frequency,callback,nextcallback)
{
    connection.query('insert into keywords (keyword) values("'+ keyword+'")', function(err, rows)
                         {
                            if (err)
                                console.log("duplicate entry");
                            callback(keyword,user,frequency,nextcallback);
                        });
   
}

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




module.exports = database;