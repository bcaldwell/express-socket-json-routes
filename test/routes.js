var test = require('unit.js');
// test 'string' type
test.should('foobar').be.type('string');
// then that actual value '==' expected value
test.should('foobar' == 'foobar').be.ok;
// then that actual value '===' expected value
test.should('foobar').be.equal('foobar');
// Should.js library (alternative style)
var should = test.should;
// test 'string' type
('foobar').should.be.type('string');
// then that actual value '==' expected value
('foobar' == 'foobar').should.be.ok;
// then that actual value '===' expected value
('foobar').should.be.equal('foobar');
// this shortcut works also like this
// test 'string' type
should('foobar').be.type('string');
// then that actual value '==' expected value
should('foobar' == 'foobar').be.ok;
// then that actual value '===' expected value
should('foobar').be.equal('foobar');
