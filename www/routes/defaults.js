var express = require('express');
var router = express.Router();

/* GET index listing. */
router.get('/', function(req, res, next) {
  // res.send('...');
  res.render('index', { title: 'infined' });
});

module.exports = router;
