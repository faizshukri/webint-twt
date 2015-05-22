var express = require('express'),
    router  = express.Router();
    database=require('../lib/database');
var utils   = require('../lib/utils');

/**
* GET /database
*/
router.get('/', function(req, res, next) 
{
  res.render('databases/index', { path: 'database' });
});

/**
* GET /database/userDetails
*/
router.get('/userDetails', function(req, res, next) 
{
	database.getUserDetails(req.query.username,function(user_details,venues,contacts)
	{
		res.render('databases/user-details', { path: 'database', users:user_details,venue:venues,contact:contacts });
	});
  
});

/**
* GET /database/getUsers
*/
router.get('/getUsers', function(req, res, next)
{
  
	database.userByVenues(req.query.venue,function(user_details)
	{
    console.log("in routes"+user_details[0].name)
  		res.render('databases/user-venue', { path: 'database',users:user_details,venue:req.query.venue});
	});
});

/**
* GET /database/usernames
*/
router.get('/usernames', function(req, res, next) {
  //console.log(req.query.usernames);
	database.getUsernames(req.query.usernames,function(users)
	{
 	  users = utils.pluckselect2( users, ['twitter_id', 'twitter_id'] );
      users = users.map(function(obj){
        obj['text'] = '@'+obj['text'];
        return obj;
    });
      res.send(users);
    });
  
});

/**
* GET /database/venues
*/
router.get('/venues', function(req, res, next) {
	database.getVenues(req.query.venue,function(venues)
	{
 	  venues = utils.pluckselect2( venues, ['name', 'name'] );
      venues = venues.map(function(obj){
        obj['text'] = obj['text'];
        return obj;
    });
      res.send(venues);
    });
  
});

module.exports = router;
