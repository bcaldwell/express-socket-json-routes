var test = require("unit.js");
var request = require("supertest");

var should = test.should;

//server setup stuff
var routes = require("../../index.js");

var test1 = require("./testconfigs/test1.js");

var express = require("express");
var socket = require("socket.io");

var app = express();
var server = require("http").Server(app);
var io = socket(server);

routes(test1, app, io);

//if (!module.parent) {
  server.listen(3000);
  console.log("Express started on port 3000");
//}
//////////////////////////////////////////////////

var socketClient = require('socket.io-client');

var socketURL = "http://localhost:3000";
//var client1 = require('socket.io-client')('http://localhost:3000');
var socketOptions ={
  transports: ['websocket'],
  'force new connection': true
};


var client = socketClient(socketURL, socketOptions);

var route200 = function(route) {
  it(route, function(done) {
    request(app)
      .get(route)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
};

var socket200 = function(route) {
  it(route, function(done) {
      client.emit(route, {});
      client.once(route, function(data) {
        data.should.exist;
        done();
      });
  });
};

describe("Set up should work", function() {
  it("should require a json config", function() {
    routes(null, app, io).should.equal(false);
  });
  it("should return a router if express not passed in", function() {
    routes(test1);
  });
  it ("Should connect to the socket", function(done){
    client.once("connect", function(){
      done()
    })
  })
});

describe("Only configured routes should return 200 code (express)", function() {
  route200("/test");
  route200("/hello");
  route200("/sup");
});

describe("Only configured routes should return 200 code (socket)", function() {
  socket200("test/get");
  socket200("hello");
  socket200("bye");
});

// test "string" type
// describe("Check Initial Setup", function() {
//   it("App and io should start as null", function(){
//     ("foobar").should.be.type("string");
//   });
// });
