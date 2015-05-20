var express = require('express'),
    router  = express.Router();

var utils   = require('../lib/utils'),
    search  = require('../lib/search');

/* GET tweet page. */
router.get('/places', function(req, res, next) {
  if(req.query.location_id){
    search.searchPlaces(req.query, 10, req.query.source, function(places){
      res.send(places);
    });
  }
});

router.get('/users', function(req, res, next) {
  var username = req.query.username || req.query.usernames;
  search.searchUsers(username, 10, function(data){
    res.send(data);
  });
});

router.get('/tweets', function(req, res, next){
  var url = req.query.url;
  search.searchTweetNextResult(url, function(data){
    console.log(data);
    var statuses = utils.removeDuplicateObjectInArray(data.statuses, 'user.id');
    res.render('users/venue_visitors_next', { statuses: statuses, next_results: require('querystring').escape(data.search_metadata.next_results) });
  });
});

module.exports = router;
