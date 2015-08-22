var test = require('unit.js');
var should = test.should;

var express = require('express');
var socket = require('socket.io');
var routes = require('.././index.js');

// test 'string' type
describe('Testing', function() {
  it('be awesome', function(){
    ('foobar').should.be.type('string');
  });
});
