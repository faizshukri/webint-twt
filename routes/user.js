var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var user = require('../lib/user');

/* GET user page. */
router.get('/', function(req, res, next) {
  res.render('users/index', { path: 'user'});
});

router.get('/interesting-venues', function(req, res, next) {
  res.render('users/interesting_venues', { path: 'user'});
});

router.get('/venue-visitors', function(req, res, next) {
  var params = req.query;
  user.getVenueVisitors(params.location, params.days_limit, function(data){
    var statuses = data.statuses;
    res.render('users/venue_visitors', { path: 'user', place: params.place_name, statuses: statuses });
  });
});



module.exports = router;
