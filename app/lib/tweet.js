var twitter = require('../services/twitter');

var tweet = {};

tweet.searchKeywordTweets = function(callback){
  twitter.get('search/tweets', {q: 'asdfghjkl'}, function(err, data, response){
    callback(data);
  });
}

module.exports = tweet;
