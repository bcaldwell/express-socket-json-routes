//TODO
// - socket.io middleware mode
// - socket.io res, req objects
// - Method to get array of routes

var _ = require('lodash');
var util = require('util');
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
      if (mode.express) {
        if (route.middleware) {
          app[type](uri, route.middleware, route.handler);
        } else {
          app[type](uri, route.handler);
        }
      }

      if (mode.socket) {
        var socketUri = uri.substr(1) + (type !== 'all' ? '/' + type : '');
        console.log(socketUri);
        io.on('connection', function(socket) {
          socket.on(socketUri, function(data) {
            console.log(socketUri);
            route.handler({
              socket: socket,
              routeType: 'socket',
              socketRoute: true,
              expressRoute: false,
              baseUrl: socketUri,
              body: data,
              originalUrl: socketUri
            }, {
              send: function(data) {
                socketSend(socket, socketUri, data);
              },
              json: function(data) {
                data.contentType = "JSON";
                socketSend(socket, socketUri, data);
              },
              render: function(data) {
                socketSend(socket, socketUri, data);
              },
              end: function() {},
              sendFile: function() {
                unsupportedMethod('sendFile');
              },
              redirect: function() {
                unsupportedMethod('sendFile');
              }
            });
          });
        });
      }
    });
  } else {
    console.log('Express-socket-json-route: No routes were passed in');
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

var socketSend = function(socket, uri, data) {
  console.log('sending: ' + data);
  socket.emit(uri, data);
};

var unsupportedMethod = function(method) {
  console.log('Express-socket-json-route: Method \'' + method + '\'is not supported');
};
