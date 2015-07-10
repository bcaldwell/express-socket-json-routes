# express-socket-json-routes
[![npm version](https://badge.fury.io/js/express-socket-json-routes.svg)](http://badge.fury.io/js/express-socket-json-routes)

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
var server = require('http').Server(app);
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
jsonRoutes (routes, express, socket);

//create only express routes
jsonRoutes (routes, express);

//create only socket routes
jsonRoutes (routes, socket);

//use as expres middleware
app.use ('/api', jsonRoutes)
```

## Route Configuration Options

```javascript
var config = {
  baseUri: 'base uri for all routes. All routes are extended off of the base',
  expressUri: 'base uri for only express rest routes',
  restUri: 'same as expressUri',
  socketUri: 'base uri for only socket real time routes',
  //vars object is passed to every callback function as req.vars
  vars: {
    testvar: 'hello'
  },
  routesListRoute: 'route that contains all of the express and socket routes created. The default is /routes'
  routes: [
    {
      type: "get",  //requestion type. Ex: 'get', 'put', 'post', 'all'
      uri: "test",  // uri of the route
      //callback handler
      handler: function (req, res){
        res.send ('hello');
      },
      middleware: [] //middleware for express
    }
  ]
};
```
