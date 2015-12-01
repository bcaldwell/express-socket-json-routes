module.exports = function(){
  var express = require("express");
  var socket = require("socket.io");

  var app = express();
  var server = require("http").Server(app);
  var io = socket(server);

  app.engine('html', require('ejs').renderFile);

  routes(test1, app, io);

  server.listen(3000);
  console.log("Express started on port 3000");
};
