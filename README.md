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
jsonRoutes (routes, express, io);

//create only express routes
jsonRoutes (routes, express);

//create only socket routes
jsonRoutes (routes, io);

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

##License
The MIT License ([MIT](LICENSE))

Copyright (c) 2016 Benjamin Caldwell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

