var test = require("unit.js");
var request = require("supertest");

var should = test.should;

var express = require("express");
var socket = require("socket.io");
var routes = require("../.././index.js");

var test1 = require("./testconfigs/test1.js");

var app = express();
var server = require("http").Server(app);
var io = socket(server);

routes(test1, app, io);

if (!module.parent) {
    server.listen(3000);
    console.log("Express started on port 3000");
}

var route200 = function (route){
  it(route, function(done){
    request(app)
      .get(route)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });
};

describe("Set up should work", function(){
  it("should require a json config", function(){
    routes(null, app, io).should.equal(false);
  });
  it ("should return a router if express not passed in", function(){
    routes(test1);
  });
});

describe("Only configured routes should return 200 code", function(){
  route200("/test");
  route200("/hello");
  route200("/sup");
});

// test "string" type
// describe("Check Initial Setup", function() {
//   it("App and io should start as null", function(){
//     ("foobar").should.be.type("string");
//   });
// });
