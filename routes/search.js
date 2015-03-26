var express = require('express');
var router = express.Router();

var Twitter = require('twit');
var client = new Twitter({
    consumer_key        : config.app.twitter.consumer_key,
    consumer_secret     : config.app.twitter.consumer_secret,
    access_token    : config.app.twitter.access_token,
    access_token_secret : config.app.twitter.access_token_secret
});

// console.log(config.app.twitter.consumer_key.toString());
// console.log(config.app.twitter.consumer_key, config.app.twitter.consumer_secret, config.app.twitter.access_token, config.app.twitter.access_token_secret);


/* GET tweet page. */
router.get('/places', function(req, res, next) {
    var location = req.query.location;
    if(location){
        client.get('geo/search', { query: location, max_results: 5 }, function(error, places){
          if(error) throw error;
          places = pluckselect2( places.result.places, ['id', 'full_name'] );
          res.send(places);
        });
    }
  
});

function search_name(name){

}

function search_coordinates(latitude, longitude){

}

function pluckselect2(obj, key) {
    return obj.map(function(elem){
        return {
            key   : elem[key[0]],
            value : elem[key[1]]
        };
    });
};

module.exports = router;
