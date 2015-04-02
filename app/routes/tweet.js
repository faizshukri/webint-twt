var express = require('express');
var router = express.Router();
var twitter = require('../lib/twitter');
var tweet = require('../lib/tweet');

/* GET tweet page. */
router.get('/', function(req, res, next) {
  tweet.searchKeywordTweets(function(result){
  	console.log(result);
  });
  res.render('tweets/index', { path: 'tweet'});
});

module.exports = router;
