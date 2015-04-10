var express = require('express'),
    router  = express.Router();

var twitter = require('../services/twitter'),
    tweet   = require('../lib/tweet');

/* GET tweet page. */
router.get('/', function(req, res, next) {
  tweet.searchKeywordTweets(function(result){
  	console.log(result);
  });
  res.render('tweets/index', { path: 'tweet'});
});

module.exports = router;
