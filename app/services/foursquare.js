var foursquare = require('node-foursquare');
var client = foursquare({
  'secrets' : {
    'clientId'     : config.foursquare.client_id,
    'clientSecret' : config.foursquare.client_secret,
    'redirectUrl'  : config.foursquare.redirect_url
  }
});

client.access_token = config.foursquare.access_token;

module.exports = client;