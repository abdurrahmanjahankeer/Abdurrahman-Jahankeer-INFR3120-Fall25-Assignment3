// Load environment variables (like your secret database link) from the .env file
require('dotenv').config();

// I imported the function for connecting to the MongoDB database
const connectDB = require('./db');

// i connected to the database so it can save and read data
connectDB();

// Import modules that add special features to my app
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');
let cors = require('cors');
let userModel = require('../model/user');
let User = userModel.User;

// The DB connection is handled by `server/config/db.js` through connectDB()
// (we already call `connectDB()` above). No further action required here.

// Import other files that organize the site by pages
var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var assignmentsRouter = require('../routes/assignments');

// I made the website app using Express
var app = express();

// Set-up Express Session
app.use(session({
  secret: "Somesecret",
  saveUninitialized: false,
  resave: false
}))

// initialize flash
app.use(flash());

// user authentication
passport.use(User.createStrategy());

// serialize and deserialize the user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// initialize the passport
app.use(passport.initialize());
app.use(passport.session());

// I told Express where to find the HTML page templates
app.set('views', path.join(__dirname, '../../server/views'));

// I set EJS as your template engine so you can use <%= %> in the pages
app.set('view engine', 'ejs');

// I Added helper tools to my app
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve files like images, CSS, and icons from these folders
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Setting up my main website pages by connecting routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/assignments', assignmentsRouter);

// Run this if someone visits a page that doesn't exist (shows a 404 error)
app.use(function(req, res, next) {
    next(createError(404));
});

// Run this if an error happens anywhere in the app (shows an error page)
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error', { title: 'Error' });
});

// Give the app to other files that need it
module.exports = app;