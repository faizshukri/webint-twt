var express = require('express');
var router = express.Router();
var twitter = require('../lib/twitter');
var search = require('../lib/search');

/* GET tweet page. */
router.get('/places', function(req, res, next) {
    var location = req.query.location;
    if(location){
        twitter.get('geo/search', { query: location, max_results: 5 }, function(error, places){
          if(error) throw error;
          places = search.pluckselect2( places.result.places, ['id', 'full_name'] );
          res.send(places);
        });
    }
  
});

module.exports = router;
