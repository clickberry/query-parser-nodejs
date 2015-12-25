var assert = require('assert');
var sinon = require('sinon');

var logic = require('../lib/logic');

describe('Logic Tests', function () {
    var exp1 = 'exp1';
    var exp2 = 'exp2';
    var exp3 = 'exp3';
    var exp4 = 'exp4';
    var exp5 = 'exp5';

    it('Without', function () {
        var str = '1';
        var stub = sinon.stub();
        stub.withArgs('1').returns(exp1);

        var value = logic.parse(str, stub);
        console.log(JSON.stringify(value));

        assert.equal(value, exp1);
        assert.equal(value.and, undefined);
        assert.equal(value.or, undefined);
    });

    it('AND', function () {
        var str = '1 and 2';
        var stub = sinon.stub();
        stub.withArgs('1').returns(exp1);
        stub.withArgs('2').returns(exp2);

        var value = logic.parse(str, stub);
        console.log(JSON.stringify(value));

        assert.equal(value.and[0], exp1);
        assert.equal(value.and[1], exp2);
        assert.equal(value.or, undefined);
    });

    it('OR', function () {
        var str = '1 or 2';
        var stub = sinon.stub();
        stub.withArgs('1').returns(exp1);
        stub.withArgs('2').returns(exp2);

        var value = logic.parse(str, stub);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0], exp1);
        assert.equal(value.or[1], exp2);
        assert.equal(value.and, undefined);
    });

    it('AND & OR', function () {
        var str = '1 and 2 or 3';
        var stub = sinon.stub();
        stub.withArgs('1').returns(exp1);
        stub.withArgs('2').returns(exp2);
        stub.withArgs('3').returns(exp3);

        var value = logic.parse(str, stub);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0].and[0], exp1);
        assert.equal(value.or[0].and[1], exp2);
        assert.equal(value.or[1], exp3);
    });

    it('AND & OR & AND & OR', function () {
        var str = '1 and 2 or 3 and 4 or 5';
        var stub = sinon.stub();
        stub.withArgs('1').returns(exp1);
        stub.withArgs('2').returns(exp2);
        stub.withArgs('3').returns(exp3);
        stub.withArgs('4').returns(exp4);
        stub.withArgs('5').returns(exp5);

        var value = logic.parse(str, stub);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0].and[0], exp1);
        assert.equal(value.or[0].and[1], exp2);
        assert.equal(value.or[1].and[0], exp3);
        assert.equal(value.or[1].and[1], exp4);
        assert.equal(value.or[2], exp5);
    });
});