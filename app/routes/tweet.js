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
	var status;
	var date;
	var created;

	tweet.searchKeywordTweets(input.keyword, 21, function(result)
	 {
	 	status = result.statuses;
	 	status.forEach(function(res){
	 		console.log(res.created_at);
	 		created = res.created_at;
	 	})

	 	//date = created.substring(4,11);
		//console.log(date);

	 	res.render('tweets/discussions', { path: 'tweet', keyword: input.keyword, date: date, tweets: status});
  	});
	
  	// nak pass to view 
  	
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




