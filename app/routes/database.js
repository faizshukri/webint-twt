var express = require('express'),
    router  = express.Router();
    database=require('../lib/database');
var utils   = require('../lib/utils');

/* GET home page. */
router.get('/', function(req, res, next) 
{
  res.render('databases/index', { path: 'database' });
});
/* GET details of a particular user*/
router.get('/userDetails', function(req, res, next) 
{
	database.getUserDetails(req.query.username,function(user_details,venues,contacts)
	{
		res.render('databases/user-details', { path: 'database', users:user_details,venue:venues,contact:contacts });
	});
  
});
/* GET list of users who vivsited a particular venue*/
router.get('/getUsers', function(req, res, next)
{
	database.userByVenues(req.query.venue,function(venues)
	{
  		res.render('databases/user-venue', { path: 'database' });
	});
});

/* GET list of users from database */
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
/* GET list of venues from database */
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
