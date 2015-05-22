var express = require('express'),
    router  = express.Router();

var twitter = require('../services/twitter'),
    tweet   = require('../lib/tweet');

/**
* GET /tweet
*/
router.get('/', function(req, res, next) {

  res.render('tweets/index', { path: 'tweet'});
});

/**
* GET /tweet/discussions
*/
router.get('/discussions', function(req, res, next) 
{
	var input = req.query;

	var searchKeyword = function(geocode){
		tweet.searchKeywordTweets(input.keyword, geocode, input.count, function(result)
         {
            // pass to view
            res.render('tweets/discussions', { path: 'tweet', keyword: input.keyword, tweets: result.statuses});
        });
	}

	if(input.location_id){
	    tweet.getGeoDetails(input.location_id, function(result){
	        searchKeyword([result.centroid[1], result.centroid[0], '2mi'].join(','));
	    });
	} else {
		searchKeyword(null);
	}
});	

/**
* GET /tweet/retweet
*/
router.get('/retweet', function(req, res, next) 
{
	var params = req.query;

	tweet.getRetweetNum(params.id, 12, function(result)
	 {
	 	// nak pass to view
	 	res.render('tweets/retweet', { path: 'tweet', tweets: result});
 	});	
 });


router.get('search/tweets', function(req, res, next){

});

module.exports = router;


