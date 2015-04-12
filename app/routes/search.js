var express = require('express'),
    router  = express.Router();

var utils   = require('../lib/utils'),
    search  = require('../lib/search');

/* GET tweet page. */
router.get('/places', function(req, res, next) {
  var location = req.query.location;
  if(location){
    search.searchPlaces(location, 10, function(places){
      places = utils.pluckselect2( places.result.places, ['id', 'full_name'] );
      res.send(places);
    });
  }
});

router.get('/users', function(req, res, next) {
  var username = req.query.username;
  if (!username)
  {
    username=req.query.usernames
  }
  if(username){
    search.searchUsers(username, 10, function(users){
      users = utils.pluckselect2( users, ['screen_name', 'screen_name'] );
      users = users.map(function(obj){
        obj['text'] = '@'+obj['text'];
        return obj;
      });
      res.send(users);
    });
  }
});

router.get('/tweets', function(req, res, next){
  var url = req.query.url;
  search.searchTweetNextResult(url, function(data){
    var statuses = utils.removeDuplicateObjectInArray(data.statuses, 'user.id');
    res.render('users/venue_visitors_next', { statuses: statuses, next_results: require('querystring').escape(data.search_metadata.next_results) });
  });
});

module.exports = router;
