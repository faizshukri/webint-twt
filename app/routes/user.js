var express = require('express'),
    router  = express.Router();

var db      = require('../lib/db'),
    user    = require('../lib/user'),
    utils   = require('../lib/utils');

/* GET user page. */
router.get('/', function(req, res, next) {
  res.render('users/index', { path: 'user'});
});

router.get('/topic-discussed', function(req, res, next) {
  console.log(req.query.username+"yipee");
  res.render('users/topic-discussed',{ path: 'user'});
});

router.get('/profile/:username', function(req, res, next) {

  var username = req.params.username;

  user.getUserTweets(username, 100, function(data){

    // If the user has tweet, grab the user object from the first tweet
    if(data.length > 0){
        var author = data[0].user;
        res.render('users/profile', { path: 'user', author: author, tweets: data });
    // If the user does not have any tweet, search from twitter again
    } else {
        user.getUser(username, function(data){
          var author = data;
          res.render('users/profile', { path: 'user', author: author, tweets: [] });
        });
    }
  });
  
});

router.get('/interesting-venues', function(req, res, next) {
  var params = req.query;
  res.render('users/interesting_venues', { path: 'user', username: params.username, days: params.days_limit });
});

router.get('/venue-visitors', function(req, res, next) {
  var params = req.query;

  // If some parameter is not exist, we redirect back to /user
  if(!params.location && ( !params.latitude || !params.longitude ) && !params.days_limit)
    res.redirect('/user');

  user.getVenueVisitors(params, 50, function(data){
    var statuses = utils.removeDuplicateObjectInArray(data.statuses, 'user.id');
    res.render('users/venue_visitors', { path: 'user', place: params.place_name, statuses: statuses, days: params.days_limit });
  });
});



module.exports = router;
