var foursquare = require('node-foursquare');
var client = foursquare({
  'secrets' : {
    'clientId'     : config.foursquare.client_id,
    'clientSecret' : config.foursquare.client_secret,
    'redirectUrl'  : config.foursquare.redirect_url
  }
});

client.access_token = config.foursquare.access_token;
var foursquare_venues = require('node-foursquare-venues')(config.foursquare.client_id, config.foursquare.client_secret)

module.exports = client;