var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const title  = 'welcome'
  res.render('index', {
    title: title
  });
  //console.log(`sd`);
});

module.exports = router;
