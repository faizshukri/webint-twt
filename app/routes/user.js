var express = require('express'),
    router  = express.Router();

var db         = require('../services/db'),
    foursquare = require('../services/foursquare'),
    user       = require('../lib/user'),
    place      = require('../lib/place'),
    search     = require('../lib/search'),
    utils      = require('../lib/utils');


/**
* GET /user
*/
router.get('/', function(req, res, next) {
  res.render('users/index', { path: 'user'});
});

/**
* GET /user/topic-discussed
*/
router.get('/topic-discussed', function(req, res, next) {
  var params = req.query
  if(!params.username)
    {
      res.redirect('/user');
    }
  else
  {
  user.getUserTopics(params,function(data,users_freq)
  { 
    

    res.render('users/topic-discussed',{ path: 'user',datasent:users_freq});
  })
}
  
});

/**
* GET /user/profile/{username}
*/
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

/**
* GET /user/interesting-venues
*/
router.get('/interesting-venues', function(req, res, next) {
  var params = req.query;

  if(params.days_limit == 0){
    res.render('users/interesting_venues', { path: 'user', username: params.username, tweets: [], days: params.days_limit });
    return;
  }

  // Get user tweets since
  user.getUserTweetSince(params.username, params.days_limit, 300, function(data){

    var tweets  = place.filterPlaceName(data.statuses),
        counter = 0;

    // If no tweet found, render the page with a notice
    if(tweets.length <= 0)
      res.render('users/interesting_venues', { path: 'user', username: params.username, tweets: [], days: params.days_limit });
 
    tweets.forEach(function(tweet, index){
      place.getInterestingPlaces(tweet.place_name, function(data){

        // Assign data to tweet.gplace
        tweets[index].gplace = data;
        counter++;

        if(counter == tweets.length)
          res.render('users/interesting_venues', { path: 'user', username: params.username, tweets: tweets, days: params.days_limit, api_key: config.google.api_key });
      });
    });
  });
});

/**
* GET /user/venue-visitors
*/
router.get('/venue-visitors', function(req, res, next) {
  var params = req.query;

  // If days_limit is 0, we stream it.
  if(params.days_limit == 0){
    res.render('users/venue_visitors', { path: 'user', params: params, statuses: [] });
    return;
  }
  // If some parameter is not exist, we redirect back to /user
  if(!params.location && ( !params.latitude || !params.longitude ) && !params.days_limit)
    res.redirect('/user');

  // Get visitors for a specific venue
  user.getVenueVisitors(params, 20, function(data){
    var statuses = utils.removeDuplicateObjectInArray(data.statuses, 'user.id');
    res.render('users/venue_visitors', { path: 'user', params: params, statuses: statuses, next_results: require('querystring').escape(data.search_metadata.next_results) });
  });
});

/**
* GET /user/nearby-places
*/
router.get('/nearby-places', function(req, res, next){
  var params = req.query;

  // Get the nearby venues using coordinates
  search.getNearbyVenues(params.x, params.y, function(data){
    var options = { places: data, coordinates: { x: params.x, y: params.y} };

    // If the url is access by ajax, render just the content
    if(req.xhr) res.render('users/nearby_places', options);
    // Else render the whole page
    else res.render('users/nearby_places_page', options);

  });
});

module.exports = router;
