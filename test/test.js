var assert = require('assert');
var sinon = require('sinon');

var Expression = require('../lib/expression');
var filter = require('../lib/filter');

function createMock(expression){
    var mock=sinon.mock(expression);
    //mock.expects('getExpTemplate').once().returns('expression1');
    //mock.expects('getExp').withArgs('expression1').returns('exp1');

    return mock;
}

describe('Test', function () {
    var expression1 = 'expression1';
    var expression2 = 'expression2';
    var expression3 = 'expression3';
    var expression4 = 'expression4';
    var expression5 = 'expression5';

    //var query = {
    //    '$filter': expression1 + ' and ' + expression2
    //};

    it('Without', function () {
        var filterStr = expression1;
        //var mock = sinon.mock(Expression);
        var expression=new Expression(filterStr);
        var mock=createMock(expression);

        mock.expects('getExpTemplate').once().returns(expression1);
        mock.expects('getExp').withArgs(expression1).returns('exp1');
        //var f = filter(mock);
        var f = filter(expression);

        f.getLogics(filterStr, function (err, value) {
            console.log(filterStr);
            console.log(value);

            assert.equal(value, 'exp1');
        });

        mock.verify();
    });

    it('AND & OR', function () {
        var filterStr = expression1 + ' and ' + expression2 + ' or ' + expression3;
        var expression=new Expression(filterStr);

        var mock=createMock(expression);
        mock.expects('getExpTemplate').once().returns(filterStr);
        mock.expects('getExp').withArgs(expression1).returns('exp1');
        mock.expects('getExp').withArgs(expression2).returns('exp2');
        mock.expects('getExp').withArgs(expression3).returns('exp3');

        var f=filter(expression);
        f.getLogics(filterStr, function (err, value) {
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.or[0].and[0], 'exp1');
            assert.equal(value.or[0].and[1], 'exp2');
            assert.equal(value.or[1], 'exp3');
        });
    });
});