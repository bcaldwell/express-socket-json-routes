var test = require('unit.js');
// test 'string' type
test.should('foobar').be.type('string');
// then that actual value '==' expected value
test.should('foobar' == 'foobar').be.ok;
