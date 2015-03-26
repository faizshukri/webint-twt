var Twitter = require('twit');
var client = new Twitter({
    consumer_key        : config.app.twitter.consumer_key,
    consumer_secret     : config.app.twitter.consumer_secret,
    access_token        : config.app.twitter.access_token,
    access_token_secret : config.app.twitter.access_token_secret
});

module.exports = client;