var express = require('express');
var socket = require('socket.io');
var routes = require('./index.js');

var app = express();
var server = require('http').Server(app);
var io = socket(server);

var config = {
  // baseUrl: '',
  // vars: {
  //   testvar: 'hello'
  // },
  routes: [
    {
      type: "get",
      uri: "test",
      handler: function (req, res){
        res.send ('hello');
      },
      middleware: []
    },
    {
      type: "all",
      uri: "hello",
      handler: function (req, res){
        res.json ({'sup dawg': false});
      },
      middleware: []
    }
  ]
};

// routes(config, app);
routes(config, app, io);

app.use ('/api', routes(config));

app.get('/', function(req, res) {
  res.send('Hello form root route.');
});

/* istanbul ignore next */
if (!module.parent) {
  server.listen(3000);
  console.log('Express started on port 3000');
}
