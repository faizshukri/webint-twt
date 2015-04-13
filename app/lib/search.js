var twitter     = require('../services/twitter'),
    querystring = require('querystring');

var search = {};

/**
*   Search places from location provided
*   @return Array of places object
*/
search.searchPlaces = function(location, count, callback){
  twitter.get('geo/search', { query: location, max_results: count }, function(err, data, response){
    if(err) throw err;
    callback(data);
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
    callback(data);
  });
}

module.exports = search;
