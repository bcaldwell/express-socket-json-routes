process.env.DEBUG = "express-socket-json-routes";

var express = require('express');
var socket = require('socket.io');
var routes = require('../index.js');

var app = express();
var server = require('http').Server(app);
var io = socket(server);

var config = require("./unit/testconfigs/test1.js");

// routes(config, app);
process.env.DEBUG = "express-socket-json-routes";
routes(config, app, io);

// app.use ('/api', routes(config));

var count = 0;
routes({routes:[
  {
    uri: "news",
    type: "all",
    handler:function(req,res){
      res.send("Hello: " + count++);
    }
  }
]}, app, io);

app.get('/', function (req, res) {
  res.send('Hello form root route.');
});

/* istanbul ignore next */
if (!module.parent) {
  server.listen(3000);
  console.log('Express started on port 3000');
}
