// yang deal dgn API. 

var twitter = require('../services/twitter');

var tweet = {};

// keyword_string, count, 
tweet.searchKeywordTweets = function(keyword_string, count, callback)
{
    twitter.get('search/tweets', {q: keyword_string, count: count }, 

    function(err, data, response)
    {
        callback(data);
    });
}

// keyword_string, count:count

module.exports = tweet;
