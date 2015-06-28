var _ = require('lodash');
module.exports = function (config, app, socket){
  var middlewareMode = instanceofExpress(app);
  //make sure config object was passed in
  if (!_.isObject(config)){
    console.log ('No configuration json passed in');
    return;
  }
  //check if app and socket exist
  if (!middlewareMode){
    var express = require ('express');
    app = express.Router();
  }
  instanceofSocket(socket)? null: socket = null;
  //create global vars var
  var vars = config.vars? config.vars: null;

  console.log ('express: ' + Boolean(app) + "\nsocket: " + Boolean(socket));


  if (_.isArray(config.routes)){
    _.each (config.routes, function(route){
      var type = route.type.toLowerCase();
      var url = (config.baseUrl?config.baseUrl:"") + '/' + route.route;
      console.log ('type: '+type+"\nurl: " + url);
      app[type](url, route.handler);
    });
  }

  if (!middlewareMode){
    return app;
  }
};

var instanceofExpress = function (app){
    //check for var/ functions that express apps/routers should have
    var result = Boolean(app) && Boolean(app.get) && Boolean(app.post) && Boolean(app.put) && Boolean(app.route) && Boolean(app.all) && Boolean(app.param);

    return result;
};

var instanceofSocket = function (io){
  var result = Boolean(io) && Boolean(io.on) && Boolean(io.serveClient) && Boolean(io.attach);

  return result;
};
