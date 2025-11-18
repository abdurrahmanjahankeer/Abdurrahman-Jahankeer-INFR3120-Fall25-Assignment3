#!/usr/bin/env node

// This loads secret settings (like your database link) from .env so your app can use them
require('dotenv').config();

// This grabs my main Express app from the config folder
var app = require('./server/config/app');

// This sets up a way to print useful debug messages when my app runs
var debug = require('debug')('abdurrahman-jahankeer-infr3120-fall25-assignment3:server');

// This brings in Node's HTTP server so people can visit my website
var http = require('http');

// This picks which port my website will use (3000 unless I say otherwise)
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// This actually creates the real web server using my app
var server = http.createServer(app);

// Start my server listening for people who visit the site
server.listen(port);

// Handle what happens if there's an error or when the server is ready
server.on('error', onError);
server.on('listening', onListening);

// This function makes sure the port number is safe and correct
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

// This function shows an error if something goes wrong (like if the port is busy)
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// This function prints out a nice message when my server is up and running
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}