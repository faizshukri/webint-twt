var express = require('express'),
    router  = express.Router();

/**
* GET /
* HOME PAGE
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', path: '/' });
});

module.exports = router;
