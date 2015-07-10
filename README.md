# express-socket-json-routes

[![npm version](https://badge.fury.io/js/express-socket-json-routes.svg)](http://badge.fury.io/js/express-socket-json-routes)


##Installation
-----------

```
npm install express-socket-json-routes
```

##Basic Usage

```javascript
var express = require('express');
var socket = require('socket.io');
var jsonRoutes = require('express-socket-json-routes');

var app = express();
var server = require('http').Server(app);
var io = socket(server);

//json configuration object for route creation
var routes = {};

//create both express and socket routes
jsonRoutes (routes, express, socket);

//create only express routes
jsonRoutes (routes, express);

//create only socket routes
jsonRoutes (routes, socket);

//use as expres middleware
app.use ('/api', jsonRoutes)

```
