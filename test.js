var express = require('express');
var socket = require('socket.io');
var routes = require('./index.js');

var app = express();
var io = socket();

var config = {
  // baseUrl: '',
  vars: {
    testvar: 'hello'
  },
  routes: [
    {
      type: "get",
      route: "test",
      handler: function (req, res){
        res.send ('hello');
      },
      middleware: []
    },
    {
      type: "get",
      route: "hello",
      handler: function (req, res){
        res.send ('sup dawg');
      },
      middleware: []
    }
  ]
};

routes(config, app);
// routes(config, app, io);

app.use ('/api', routes(config));

app.get('/', function(req, res) {
  res.send('Hello form root route.');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
