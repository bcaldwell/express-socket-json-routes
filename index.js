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
  var vars = config.vars ? config.vars : {};

  if (_.isArray(config.routes)) {
    //create base uri
    var baseUri = {};
    baseUri.base = (config.baseUrl ? config.baseUrl : "");
    sanitizeRoute(baseUri);
    baseUri.express = (config.expressUri ? config.expressUri : (config.restUri ? config.restUri : baseUri.base));
    baseUri.socket = (config.socketUri ? config.expressUri : baseUri.base);
    sanitizeRoute(baseUri.express);
    sanitizeRoute(baseUri.socket);

    var routeList = {
      express: [],
      socket: []
    };

    var routesKeys = Object.keys(config.routes);
    _.each(config.routes, function(route) {
      var type = route.type.toLowerCase();
      //create base uri, it should not start with a '/'
      var expressUri = (route.expressUri ? route.expressUri : (route.restUri ? route.restUri : route.uri));
      sanitizeRoute(expressUri);

      // append base url to the expressUri
      expressUri = (baseUri.express ? '/' + baseUri.express : '') + '/' + expressUri;

      if (mode.express) {
        if (route.middleware) {
          app[type](expressUri, route.middleware, function(req,res){
            req.vars = vars;
            route.handler(req, res);
            }
            );
        } else {
          app[type](expressUri, route.handler);
        }
      }

      routeList.express.push(expressUri);

      if (mode.socket) {
        //socketUri: baseuri/ + uri/ + route type
        var socketUri = (route.socketUri ? route.socketUri : route.uri + (type !== 'all' ? '/' + type : ''));
        sanitizeRoute(socketUri);
        socketUri = (baseUri.socket ? baseUri.socket + '/' : '') + socketUri;

        io.on('connection', function(socket) {
          routeList.socket.push(socketUri);

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
          //create route to view current routes
          if (routeList.socket.length === routesKeys.length) {
            socket.on((config.routesListRoute?config.routesListRoute:'routes'), function() {
              socketSend(socket, 'routes', routeList);
            });
          }
        });
      }
    });
    app.get('/' + (config.routesListRoute?sanitizeRoute(config.routesListRoute):'routes'), function(req, res) {
      res.json(routeList);
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

var sanitizeRoute = function(route) {
  if (route && route[0] && route[0] === '/')
    return route.substr(1);
  return route;
};
