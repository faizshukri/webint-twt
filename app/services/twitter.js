/**
*   Twitter object
*/

var Twitter = require('twit');

var client = new Twitter({
  consumer_key        : config.twitter.consumer_key,
  consumer_secret     : config.twitter.consumer_secret,
  access_token        : config.twitter.access_token,
  access_token_secret : config.twitter.access_token_secret
});

module.exports = client;