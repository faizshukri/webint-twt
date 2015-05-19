// yang deal dgn API. 

var twitter = require('../services/twitter');

var tweet = {};

// keyword_string, count, 
tweet.searchKeywordTweets = function(keyword_string,  geocode, count, callback)
{
    twitter.get('search/tweets', {q: keyword_string, geocode: geocode, count: count }, 

    function(err, data, response)
    {
        callback(data);
    });
}

tweet.getRetweetNum = function(id_str, count, callback)
{
	twitter.get('statuses/retweets/:id', {id: id_str, count: count},

		function(err, data, response)
		{
			callback(data)
		});
}

tweet.getGeoDetails = function(geo_id, callback)
{
    twitter.get('geo/id/:id', { id: geo_id }, function(err, data, response){
        if (err) throw err;
        callback(data);
    });
}
// keyword_string, count:count

module.exports = tweet;
