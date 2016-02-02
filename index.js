//TODO
// - socket.io middleware mode
// - socket.io res, req objects

var _ = require("lodash");
var debug = require('debug')('express-socket-json-routes');
var h = require("./helpers");

var socketSend = function(socket, uri, data, socketCb, options) {
  if (options.responseCallback && socketCb) socketCb(data);
  if (options.responseEmit) socketEmit(socket, uri, data);
};

var socketEmit = function(socket, uri, data) {
  debug("sending: " + JSON.stringify(data) + " to " + socket.id + " requested from uri " + uri);
  socket.emit(uri, data);
};

var unsupportedMethod = function(method) {
  debug("unsuported method %s was called", method);
  console.error("Express-socket-json-route: Method \"" + method + "\"is not supported. Method should be wrapped in a check");
};

var sanitizeRoute = function(route) {
  if (route && route[0] && route[0] === "/") {
    return route.substr(1);
  }
  return route;
};

module.exports = function(config, appPassed, socketPassed) {

  debug("Starting up with new configuration");

  //make sure config object was passed in
  if (!h.isObject(config)) {
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

  if (h.instanceofExpress(appPassed)) {
    app = appPassed;
  }
  if (h.instanceofSocket(socketPassed) || h.instanceofSocket(appPassed)) {
    io = socketPassed;
  }

  var mode = {
    express: settings.express.enabled || true,
    socket: settings.socket.enabled || Boolean(io),
    router: settings.express.enabled || !Boolean(app)
  };

  console.log (process.env.NODE_ENV);
  console.log (Boolean (process.env.NODE_ENV === "test"))
  if (process.env.NODE_ENV == "test") {
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
  var vars = config.vars || {};

  if (h.isArray(config.routes)) {
    //create base uri
    var baseUri = {};
    baseUri.base = config.baseUrl || "";
    baseUri.base = sanitizeRoute(baseUri.base);
    baseUri.express = config.expressUri || config.restUri || baseUri.base;
    baseUri.socket = config.socketUri || baseUri.base;
    baseUri.express = sanitizeRoute(baseUri.express);
    baseUri.socket = sanitizeRoute(baseUri.socket);

    var routeList = {
      express: [],
      socket: []
    };

    var routesKeys = Object.keys(config.routes);
    for (var i in config.routes) {
      var route = config.routes[i];
      (function scope(route) {
        var type = route.type.toLowerCase();
        //create base uri, it should not start with a "/"
        var expressUri = route.expressUri || route.restUri || route.uri;
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
            if (routeList.socket.indexOf(socketUri) < 0) routeList.socket.push(socketUri);
            route.socket = route.socket || {};
            var options = _.defaults(_.pick(route.socket, ["responseCallback", "responseEmit"]), _.pick(settings.socket, ["responseCallback", "responseEmit"]));

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
              options = _.pick(settings.socket, ["responseCallback", "responseEmit"]);
              var routesRoute = config.routesListRoute || "routes";
              socket.on(routesRoute, function(data, cb) {
                cb = cb || null;
                socketSend(socket, routesRoute, data, cb, options);
              });
            }
          });
        }
      })(route)
    };
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
