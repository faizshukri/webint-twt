var express = require('express'),
    router  = express.Router();
    database=require('../lib/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('databases/index', { path: 'database' });
});

router.get('/userDetails', function(req, res, next) {
	console.log(req.query);
	database.getUserDetails(req.query.username,function(user_details,venues,contacts)
	{
		console.log("call back of database");
		console.log(user_details);
		console.log(venues);
		console.log(contacts);
		res.render('databases/user-details', { path: 'database', user:user_details,venue:venues,contact:contacts });

	});
  
});

router.get('/getUsers', function(req, res, next) {
  res.render('databases/user-venue', { path: 'database' });
});
module.exports = router;
