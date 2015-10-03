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
      uri: "byebye",
      socketUri: "bye",
      expressUri: "sup",
      handler: function (req, res){
        res.send ('bye socket route but not rest route?');
      },
      middleware: []
    }
  ]
};
