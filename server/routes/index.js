var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const assignmentsRouter = require('./assignments');
app.use('/assignments', assignmentsRouter);

module.exports = router;
