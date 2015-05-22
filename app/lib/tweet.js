var twitter = require('../services/twitter');
var tweet = {};

/**
*   Search keyword tweets
*   @return Array of tweet object
*/
tweet.searchKeywordTweets = function(keyword_string, geocode, count, callback)
{
	var options = {q: keyword_string, count: count };
	if(geocode) options.geocode = geocode;

    twitter.get('search/tweets', options, function(err, data, response)
    {
        callback(data);
    });
}

/**
*   Search retweet
*   @return Array of tweet object
*/
tweet.getRetweetNum = function(id_str, count, callback)
{
	twitter.get('statuses/retweets/:id', {id: id_str, count: count}, function(err, data, response)
	{
		callback(data)
	});
}

/**
*   Search geo details base on its id
*   @return Geo object
*/
tweet.getGeoDetails = function(geo_id, callback)
{
    twitter.get('geo/id/:id', { id: geo_id }, function(err, data, response)
    {
        if (err) throw err;
        callback(data);
    });
}

module.exports = tweet;
