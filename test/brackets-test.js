var assert = require('assert');

var Brackets = require('../lib/brackets');

describe('Brackets Test', function () {
    var exp1 = 'exp1';
    var exp2 = 'exp2';
    var exp3 = 'exp3';
    var exp4 = 'exp4';
    var exp5 = 'exp5';

    it('Without Brackets', function () {
        var str = '1 and 2 or 3';
        var brackets=new Brackets(str);
        brackets.initialize();
        var value = brackets.getBrcTemplate();

        assert.equal(value, str);
    });

    it('AND & (OR)', function () {
        var str = '1 and (2 or 3)';
       var brackets=new Brackets(str);
        brackets.initialize();
        var value = brackets.getBrcTemplate();

        assert.equal(value, '1 and brc0');
    });

    it('(OR) & AND & (OR)', function () {
        var str = '(1 or 2) and (2 or 3)';
        var brackets=new Brackets(str);
        brackets.initialize();
        var value = brackets.getBrcTemplate();

        assert.equal(value, 'brc0 and brc1');
    });

    it('Error (AND (OR))', function () {
        var str = '(exp1 and (exp2 or exp3))'
        var brackets=new Brackets(str);
        assert.throws(brackets.initialize());
    });

    it('Error AND ((OR))', function () {
        var str = 'exp1 and ((exp2 or exp3))'
        var brackets=new Brackets(str);
        assert.throws(brackets.initialize());
    });

    it('Error AND (OR))', function () {
        var str = 'exp1 and (exp2 or exp3))'
        var brackets=new Brackets(str);
        assert.throws(brackets.initialize());
    });

    it('Get Brackets expressions', function () {
        var str = '(exp1 or exp2) and (exp3 or exp4 and exp5)';
        var brackets=new Brackets(str);
        brackets.initialize();

        var value1 = brackets.getBrc('brc0');
        var value2 = brackets.getBrc('brc1');

        assert.equal(value1, 'exp1 or exp2');
        assert.equal(value2, 'exp3 or exp4 and exp5');
    });
});