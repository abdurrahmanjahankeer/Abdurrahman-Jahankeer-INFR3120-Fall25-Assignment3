// First, let's set up Express so we can build our website
const express = require('express');

// We need a router to organize the different pages on the site
const router = express.Router();

// This is for the homepage. When someone visits '/', they see the main page!
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// This makes an About page. If someone goes to '/about', they can learn more!
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// This is the Contact page, so people can get in touch with me
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// This lets our app use these page routes for the website
module.exports = router;