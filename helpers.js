module.exports = {
  isObject: function(value){
    var type = typeof value;
    return (!!value && type == "object");
  },
  isArray: function(value){
    return Array.isArray(value);
  },
  instanceofExpress: function(app) {
    //check for var/ functions that express apps/routers should have
    return Boolean(app) && Boolean(app.get) && Boolean(app.post) && Boolean(app.put) && Boolean(app.route) && Boolean(app.all) && Boolean(app.param);
  },
  instanceofSocket: function(io) {
    return Boolean(io) && Boolean(io.on) && Boolean(io.serveClient) && Boolean(io.attach);
  }
};
