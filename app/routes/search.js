var express = require('express'),
    router  = express.Router();

var utils  = require('../lib/utils'),
    search = require('../lib/search');

/* GET tweet page. */
router.get('/places', function(req, res, next) {
    var location = req.query.location;
    if(location){
        search.getPlaces(location, 10, function(places){
            places = utils.pluckselect2( places.result.places, ['id', 'full_name'] );
            res.send(places);
        });
    }
});

module.exports = router;
