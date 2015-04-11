var express = require('express'),
    router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log(req.query.usernames);
  res.render('index', { title: 'Express', path: '/' });
});

module.exports = router;
