var path = require('path')
module.exports  = {
  // baseUri: 'tesast',
  // expressUri: 'rest',
  // restUri: 'rest',
  // socketUri: 'socket',
  vars: {
    testvar: 'hello'
  },
  // routesListRoute: 'express-socket-json-routes'
  routes: [
    {
      type: "get",
      uri: "test",
      handler: function (req, res){
        console.log (req.vars);
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
    },
    {
      type: "all",
      uri: "render",
      handler: function (req, res){
        res.render (path.resolve(__dirname + "/../../assets/example.html"));
      }
    },
    {
      type: "all",
      uri: "google",
      handler: function (req, res){
        res.redirect ("https://www.google.ca/");
      },
    },
    {
      type: "all",
      uri: "sendfile",
      handler: function (req, res){
        res.sendFile (path.resolve(__dirname + "/../../assets/openCoverage.js"));
      }
    },
    {
      type: "all",
      uri: "byebye",
      socketUri: "/bye",
      expressUri: "/sup",
      handler: function (req, res){
        res.send ('bye socket route but not rest route?');
      },
      middleware: []
    }
  ]
};
