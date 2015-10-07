//TODO
// - socket.io middleware mode
// - socket.io res, req objects
// - Method to get array of routes

var _ = require("lodash");
var util = require("util");
var debug = require('debug')('express-socket-json-routes');

module.exports = function(config, appPassed, socketPassed) {

  debug ("Starting up with new configuration");

  //make sure config object was passed in
  if (!_.isObject(config)) {
    debug("No configuration json passed in");
    console.error("Express-socket-json-route: No configuration json passed in");
    return false;
  }

  var app = null,
    io = null;
  var settings = {
    express: config.express || {},
    socket: config.socket || {
      appendHttpMethod: true,
      responseCallback: true,
      responseEmit: true,
      headerBody: false
    }
  };

  if (instanceofExpress(appPassed)) {
    app = appPassed;
  }
  if (instanceofSocket(socketPassed) || instanceofSocket(appPassed)) {
    io = socketPassed;
  }

  var mode = {
    express: settings.express.enabled || true,
    socket: settings.socket.enabled || Boolean(io),
    router: settings.express.enabled || !Boolean(app)
  };

  if (process.env.NODE_ENV === "test") {
    this.app = app;
    this.io = io;
    this.mode = mode;
  }

  debug("Express is " + mode.express);
  debug("Socket is " + mode.socket);
  debug("Express is returning a router " + mode.router);

  //check if app and socket exist
  if (mode.router) {
    var express = require("express");
    app = express.Router();
  }
  //create global vars var
  var vars = config.vars ? config.vars : {};

  if (_.isArray(config.routes)) {
    //create base uri
    var baseUri = {};
    baseUri.base = (config.baseUrl ? config.baseUrl : "");
    baseUri.base = sanitizeRoute(baseUri.base);
    baseUri.express = (config.expressUri ? config.expressUri : (config.restUri ? config.restUri : baseUri.base));
    baseUri.socket = (config.socketUri ? config.expressUri : baseUri.base);
    baseUri.express = sanitizeRoute(baseUri.express);
    baseUri.socket = sanitizeRoute(baseUri.socket);

    var routeList = {
      express: [],
      socket: []
    };

    var routesKeys = Object.keys(config.routes);
    _.each(config.routes, function(route) {
      var type = route.type.toLowerCase();
      //create base uri, it should not start with a "/"
      var expressUri = route.expressUri ? route.expressUri : (route.restUri ? route.restUri : route.uri);
      expressUri = sanitizeRoute(expressUri);

      // append base url to the expressUri
      expressUri = (baseUri.express ? "/" + baseUri.express : "") + "/" + expressUri;

      if (mode.express) {
        if (route.middleware) {
          app[type](expressUri, route.middleware, function(req, res) {
            req.vars = vars;
            route.handler(req, res);
          });
        } else {
          app[type](expressUri, route.handler);
        }
      }

      routeList.express.push(expressUri);

      if (mode.socket) {
        //socketUri: baseuri/ + uri/ + route type
        var socketUri = sanitizeRoute(route.socketUri ? route.socketUri : route.uri + (type !== "all" ? "/" + type : ""));
        socketUri = (baseUri.socket ? baseUri.socket + "/" : "") + socketUri;

        io.on("connection", function(socket) {
          routeList.socket.indexOf(socketUri) < 0? routeList.socket.push(socketUri):null;
          route.socket = route.socket || {};
          var options = _.defaults(_.pick(route.socket,["responseCallback", "responseEmit"]), _.pick(settings.socket,["responseCallback", "responseEmit"]));

          socket.on(socketUri, function(data, cb) {
            cb = cb || null;
            route.handler({
              socket: socket,
              routeType: "socket",
              socketRoute: true,
              expressRoute: false,
              baseUrl: socketUri,
              body: data,
              originalUrl: socketUri,
              vars: vars
            }, {
              send: function(data) {
                socketSend(socket, socketUri, data, cb, options);
              },
              json: function(data) {
                //data.contentType = "JSON";
                socketSend(socket, socketUri, data, cb, options);
              },
              render: function(data) {
                socketSend(socket, socketUri, data, cb, options);
              },
              end: function() {},
              sendFile: function() {
                unsupportedMethod("sendFile");
                socketSend(socket, socketUri, {}, cb, options);
              },
              redirect: function() {
                unsupportedMethod("redirect");
                socketSend(socket, socketUri, {}, cb, options);
              }
            });
          });
          //create route to view current routes
          if (routeList.socket.length === routesKeys.length) {
            var options =  _.pick(settings.socket,["responseCallback", "responseEmit"]);
            var routesRoute = config.routesListRoute ? config.routesListRoute : "routes";
            socket.on(routesRoute, function(data, cb) {
              cb = cb || null;
              socketSend(socket, routesRoute, data, cb, options);
            });
          }
        });
      }
    });
    app.get("/" + (config.routesListRoute ? sanitizeRoute(config.routesListRoute) : "routes"), function(req, res) {
      res.json(routeList);
    });
  } else {
    console.error("Express-socket-json-route: No routes were passed in");
    return false;
  }


  if (mode.router) {
    return app;
  }
  return true;
};

var instanceofExpress = function(app) {
  //check for var/ functions that express apps/routers should have
  return Boolean(app) && Boolean(app.get) && Boolean(app.post) && Boolean(app.put) && Boolean(app.route) && Boolean(app.all) && Boolean(app.param);
};

var instanceofSocket = function(io) {
  return Boolean(io) && Boolean(io.on) && Boolean(io.serveClient) && Boolean(io.attach);
};

var socketSend = function(socket, uri, data, socketCb, options){
  options.responseCallback && socketCb? socketCb(data):null;
  options.responseEmit? socketEmit (socket, uri, data): null;
};

var socketEmit = function(socket, uri, data) {
  debug("sending: " + JSON.stringify(data) + " to " + socket.id + " requested from uri " + uri);
  socket.emit(uri, data);
};

var unsupportedMethod = function(method) {
  debug ("unsuported method %s was called", method);
  console.error("Express-socket-json-route: Method \"" + method + "\"is not supported. Method should be wrapped in a check");
};

var sanitizeRoute = function(route) {
  if (route && route[0] && route[0] === "/"){
    return route.substr(1);
  }
  return route;
};
