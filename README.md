# express-socket-json-routes
[![npm version](https://badge.fury.io/js/express-socket-json-routes.svg)](http://badge.fury.io/js/express-socket-json-routes)
[![dependencies](https://david-dm.org/benjamincaldwell/express-socket-json-routes.svg)](https://david-dm.org/benjamincaldwell/express-socket-json-routes.svg)
[![Build Status](https://travis-ci.org/benjamincaldwell/express-socket-json-routes.svg?branch=master)](https://travis-ci.org/benjamincaldwell/express-socket-json-routes)
[![Coverage Status](https://coveralls.io/repos/benjamincaldwell/express-socket-json-routes/badge.svg?branch=master&service=github)](https://coveralls.io/github/benjamincaldwell/express-socket-json-routes?branch=master)

express-socket-json-routes makes it easy to create both express.js and socket.io routes simultaneously using a single json configuration object.

## Installation

--------------------------------------------------------------------------------

```
npm install express-socket-json-routes
```

## Basic Usage

```javascript
var express = require('express');
var socket = require('socket.io');
var jsonRoutes = require('express-socket-json-routes');

var app = express();
var server = require("http").Server(app);
var io = socket(server);

//json configuration object for route creation
//this json object creates a app.all('/hello') route for express and .on('hello') route for socket.io
var routes = {
  routes: [
      {
        type: "all",
        uri: "hello",
        handler: function (req, res){
          res.send ('hello world');
        },
      }
  ]
};

//create both express and socket routes
jsonRoutes (routes, express, io);

//create only express routes
jsonRoutes (routes, express);

//create only socket routes
jsonRoutes (routes, io);

//use as express middleware
app.use ('/api', jsonRoutes)
```

## Route Configuration Options

```javascript
var config = {
  baseUri: 'base uri for all routes. All routes are extended off of the base',
  express: {
    enabled: 'Boolean if express is enabled',
    router: 'forces module to return express router',
    uri: 'base uri for only express rest routes'
  }
  socket: {
    enabled: 'Boolean if sockets is enabled',
    uri: 'base uri for only socket rest routes',
    appendHttpMethod: 'determines if http method is appended to socket route',
    //example: get('/demo') socket route => demo/get
    responseCallback: 'determines if reply is done through socket callback',
    responseEmit: 'determines if reply is done through emit on socket',
    headerBody: 'determines if the socket data has http style head and body or just data'
  }
  //vars object is passed to every callback function as req.vars
  vars: {
    testvar: 'hello'
  },
  routesListRoute: 'route that contains all of the express and socket routes created. The default is /routes'
  routes: [{
    HttpMethod: "get", //http method to be used Ex: 'get', 'put', 'post', 'all'
    uri: "test", // uri of the route
    //callback handler
    handler: function(req, res) {
      console.log(req.vars.testvar) //'hello'
      res.send('hello');
    },
    express: {
      middleware: [] //middleware for express
    },
    socket: { //overwrite globals
      responseCallback: 'determines if reply is done through socket callback',
      responseEmit: 'determines if reply is done through emit on socket'
    }
  }]
};
```
