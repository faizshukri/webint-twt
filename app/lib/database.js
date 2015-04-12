var connection = require('../services/db');
var database = {};
database.storeUser= function (data)
{
     var query = 'insert into Users (id,name,description,location,photo) values("'+ data.screen_name+'""'+data.name+'""'+data.description+'""'+data.location+'""'+data.profile_image_url+'")'
     console.log(query);
    
    connection.query('insert into Users (id,name,description,location,photo) values("'+ data.screen_name+'","'+data.name+'","'+data.description+'","'+data.location+'","'+data.profile_image_url+'")', function(err, rows)
    {
        if (err)
            console.log(err);

    });
                         

}
database.storeUserKeyword= function(keyword,user,frequncy)
{

connection.query('insert into user_keywords (user_id,keyword_id,frequency) values("'+ user+'","'+keyword+'","'+frequncy+'")', function(err, rows)
                         {
                            if(err)
                                console.log(err)
                        });
                       
}

database.getKeywordID = function(keyword,user,frequency,callback)
    {
        console.log("i am here");
        var query= 'select id from keywords where keyword = "'+keyword+'"';
console.log(query);
    connection.query('select id from keywords where keyword = "'+keyword+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        else
            console.log(rows[0].id)
         callback(rows[0].id,user,frequency)
    });
   
    }

database.storeKeywords= function (user,keyword,frequency,callback,nextcallback)
{
    

    connection.query('insert into keywords (keyword) values("'+ keyword+'")', function(err, rows)
                         {
                            if (err)
                                console.log("duplicate entry");
                            else
                            {
                                
                            }
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
    		console.log(rows)
    		user_table=rows;
    	counting()
    });

    connection.query('select venues.name from venues join user_venues on (user_venues.venue_id=venues.venue_id) where user_venues.user_id="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		console.log(rows)
    		venues=rows;
    	counting()
    });

     connection.query('select * from user_contacts where originalUser="'+user+'"',function(err, rows)
    {
    	if (err)
    		console.log(err)
    	else
    		console.log(rows)
    		user_contacted=rows;
    	counting()
    });
}




module.exports = database;