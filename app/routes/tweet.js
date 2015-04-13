var express = require('express'),
    router  = express.Router();

var twitter = require('../services/twitter'),
    tweet   = require('../lib/tweet');

/* GET tweet page. */

router.get('/', function(req, res, next) {

  res.render('tweets/index', { path: 'tweet'});
});

router.get('/discussions', function(req, res, next) 
{
	var input = req.query;

	tweet.searchKeywordTweets(input.keyword, input.geocode, input.count, function(result)
	 {
	 	// pass to view
	 	res.render('tweets/discussions', { path: 'tweet', keyword: input.keyword, tweets: result.statuses});
  	});
});	
  	

router.get('/retweet', function(req, res, next) 
{
	var params = req.query;

	tweet.getRetweetNum(params.id, 12, function(result)
	 {
	 	// nak pass to view
	 	res.render('tweets/retweet', { path: 'tweet', tweets: result});
 	});	
 });

//keyword: params.keyword, tweets: result.statuses 

router.get('search/tweets', function(req, res, next){

});

module.exports = router;

// {q: 'london'},
// function(err,data,response) {console.log(data)})

/*
jade punya code;
  ul
   each tweet in tweets
    li= tweet.text
*/




