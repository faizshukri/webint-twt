var express = require('express');
var router = express.Router();

/* GET tweet page. */
router.get('/', function(req, res, next) {
  res.render('tweets/index', { path: 'tweet'});
});

module.exports = router;
