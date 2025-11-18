// First, let's set up Express so we can build routes for our site
var express = require('express');

// We need a router to organize routes for users (like a mini-app just for users)
var router = express.Router();

// This makes a page for users. When someone goes to '/users', this is what they see.
router.get('/', function(req, res, next) {
  // Just send a message back as a test. You can change this to show real users later!
  res.send('respond with a resource');
});

// This lets the app use these user routes everywhere else in the website
module.exports = router;