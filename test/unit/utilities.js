var test = require("unit.js");
var request = require("supertest");
var Q = require("q");

var should = test.should;

var socketClient = require("socket.io-client");

var socketURL = "http://127.0.0.1:3000";
//var client1 = require('socket.io-client')('http://localhost:3000');
var socketOptions = {
  forceNew: true
};

module.exports = {
  createSocket: function() {
    var defer = Q.defer();
    var client = socketClient.connect(socketURL, socketOptions);
    client.once("connect", function() {
      defer.resolve(client);
    });
    return defer.promise;
  },
  socketReturn: function(client, route) {
    it(route, function(done) {
      client.emit(route, {});
      client.once(route, function(data) {
        data.should.exist;
        done();
      });
    });
  },
  routeCode: function(app, route, status) {
    status = (status ? status : 200);
    it(route, function(done) {
      request(app)
        .get(route)
        .expect(status)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  }
};
