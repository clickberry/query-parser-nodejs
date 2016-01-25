var sinon = require('sinon');
var sinonChai=require('sinon-chai');
var chai=require('chai');
var expect=chai.expect;

var QueryParser=require('../index').QueryParser;

chai.should();
chai.use(sinonChai);

describe('Index Tests', function(){
    it('Options fail', function(){
        QueryParser.should.throw(Error);
    });
});