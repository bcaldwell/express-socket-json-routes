var test = require("unit.js");
var request = require("supertest");

var should = test.should;

var express = require("express");
var socket = require("socket.io");
var routes = require(".././index.js");

var test1 = require("./testconfigs/test1.js");

var app = express();
var server = require("http").Server(app);
var io = socket(server);

routes(test1, app, io);

if (!module.parent) {
    server.listen(3000);
    console.log("Express started on port 3000");
}

describe('GET /users', function(){
  it('respond with json', function(done){
    request(app)
      .get('/test')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });
});

// test "string" type
// describe("Check Initial Setup", function() {
//   it("App and io should start as null", function(){
//     ("foobar").should.be.type("string");
//   });
// });
