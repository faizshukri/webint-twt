var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var user = require('../lib/user');

/* GET user page. */
router.get('/', function(req, res, next) {
  res.render('users/index', { path: 'user'});
});

router.get('/profile/:username', function(req, res, next) {

  var username = req.params.username;

  user.getUserTweets(username, function(data){

    // If the user has tweet, grab the user object from the first tweet
    if(data.statuses.length > 0){
        var author = data.statuses[0].user;
        res.render('users/profile', { path: 'user', author: author, tweets: data.statuses });
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
  res.render('users/interesting_venues', { path: 'user'});
});

router.get('/venue-visitors', function(req, res, next) {
  var params = req.query;
  if(!params.location && ( !params.latitude || !params.longitude ) && !params.days_limit)
    res.redirect('/user');
  user.getVenueVisitors(params, function(data){
    var statuses = data.statuses;
    res.render('users/venue_visitors', { path: 'user', place: params.place_name, statuses: statuses, days: params.days_limit });
  });
});



module.exports = router;
