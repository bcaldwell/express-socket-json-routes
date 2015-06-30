var _ = require('lodash');
module.exports = function(config, appPassed, socketPassed) {

  var app = null,
    io = null;

  if (instanceofExpress(appPassed)) {
    app = appPassed;
  }
  if (instanceofSocket(socketPassed) || instanceofSocket(appPassed)) {
    io = socketPassed;
  }

  var mode = {
    express: true,
    socket: Boolean(io),
    middleware: !Boolean(app)
  };

  //make sure config object was passed in
  if (!_.isObject(config)) {
    console.log('Express-socket-json-route: No configuration json passed in');
    return;
  }
  //check if app and socket exist
  if (mode.middleware) {
    var express = require('express');
    app = express.Router();
  }
  //create global vars var
  var vars = config.vars ? config.vars : null;

  console.log('express: ' + mode.express + "\nsocket: " + mode.socket);

  if (_.isArray(config.routes)) {
      _.each(config.routes, function(route) {
        var type = route.type.toLowerCase();
        var uri = (config.baseUrl ? config.baseUrl : "") + '/' + route.uri;
        if (mode.express){
          if (route.middleware){
            app[type](uri, route.middleware, route.handler);
          }else {
            app[type](uri, route.handler);
          }
        }

        if (mode.socket){
          io.on('connection', function (socket) {
            console.log (uri)
            socket.on(uri.substr(1), function (data) {
              console.log(uri)
              console.log (data);
            });
          });
        }
      });
  } else {
    console.log ('Express-socket-json-route: No routes were passed in');
  }

  if (mode.middleware) {
    return app;
  }
};

var instanceofExpress = function(app) {
  //check for var/ functions that express apps/routers should have
  var result = Boolean(app) && Boolean(app.get) && Boolean(app.post) && Boolean(app.put) && Boolean(app.route) && Boolean(app.all) && Boolean(app.param);

  return result;
};

var instanceofSocket = function(io) {
  var result = Boolean(io) && Boolean(io.on) && Boolean(io.serveClient) && Boolean(io.attach);

  return result;
};
