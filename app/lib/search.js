var twitter     = require('../services/twitter'),
    foursquare  = require('../services/foursquare'),
    utils       = require('./utils')
    querystring = require('querystring');

var search = {};

/**
*   Search places from location provided
*   @return Array of places object
*/
search.searchPlaces = function(query, count, callback){
  foursquare.Venues.search( query.x, query.y, null, { query: query.location, limit: count }, foursquare.access_token, function(err, data) {
    if(err) throw err;
    places = utils.pluckselect2( data.venues, ['name', 'name'], 'foursquare');
    callback(places);
  });
}

/**
*   Search tweet from next_result url
*   @return Array of tweets object
*/
search.searchTweetNextResult = function(url, callback){
    var options = querystring.parse(url.slice(1));
    twitter.get('search/tweets', options, function(err, data, response){
        db.storeTweets(data.statuses);
        callback(data);
    });
}
/**
*   Search users by using username provided
*   @return Array of users object
*/
search.searchUsers = function(username, count, callback){
  twitter.get('users/search', { q: username, count: count }, function(err, data, response){
    if(err) throw err;
    users = utils.pluckselect2( data, ['screen_name', 'screen_name'], 'twitter');
    users = users.map(function(obj){
      obj['text'] = '@'+obj['text'];
      return obj;
    });
    callback(users);
  });
}

module.exports = search;
