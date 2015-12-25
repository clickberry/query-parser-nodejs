var assert = require('assert');
var sinon = require('sinon');

var Expression = require('../lib/expression');
var Brackets = require('../lib/brackets');
var logic = require('../lib/logic');
var Filter = require('../lib/filter');

function createClass(obj) {
    var Class = function () {
    };

    Class.prototype = obj;
    Class.obj = obj;

    return Class;
}

function createExp() {
    return createClass({
        getExpTemplate: function () {
        },
        getExp: function () {
        },
        initialize: function () {
        }
    });
}

function createBrc() {
    return createClass({
        getBrcTemplate: function () {
        },
        getBrc: function () {
        },
        initialize: function () {
        }
    });
}

function createLogic() {
    return {
        parse: function () {
        }
    };
}

describe('Filter Tests', function () {
    it('test', function () {
        var filterStr = 'filterStr';
        var expTemplate = 'expTemplate';
        var brcTemplate = 'brcTemplate';
        var obj = {};

        var Expression = createExp();
        var Brackets = createBrc();
        var logic = createLogic();

        var expressionMock = sinon.mock(Expression.obj);
        var bracketsMock = sinon.mock(Brackets.obj);
        var logicMock = sinon.mock(logic);

        expressionMock.expects('initialize').once();
        expressionMock.expects('getExpTemplate').once(filterStr).returns(expTemplate);

        //var expression = new Expression();
        //expression.initialize();
        //var res = expression.getExpTemplate(filterStr);
        //console.log(res);

        //expressionMock.expects('getExp').

        bracketsMock.expects('initialize').once();
        bracketsMock.expects('getBrcTemplate').once(expTemplate).returns(brcTemplate);

        logicMock.expects('parse').withArgs(brcTemplate).callsArg(1).returns(obj);

        var filter = new Filter(Expression, Brackets, logic);
        filter.parse(filterStr);

        expressionMock.verify();
        bracketsMock.verify();
        logicMock.verify();
    });

    it('Error', function () {
        var filterStr = 'filterStr';
        var expTemplate = 'expTemplate';
        var brcTemplate = 'brcTemplate';
        var obj = {};

        var Expression = createExp();
        var Brackets = createBrc();
        var logic = createLogic();

        var expressionMock = sinon.mock(Expression.obj);
        var bracketsMock = sinon.mock(Brackets.obj);
        var logicMock = sinon.mock(logic);

        //expressionMock.expects('initialize').once();
        //expressionMock.expects('getExpTemplate').once(filterStr).returns(expTemplate);

        //var expression = new Expression();
        //expression.initialize();
        //var res = expression.getExpTemplate(filterStr);
        //console.log(res);

        //expressionMock.expects('getExp').

        bracketsMock.expects('initialize').throws();

        var filter = new Filter(Expression, Brackets, logic);
        assert.throws(filter.parse);

        expressionMock.verify();
        //bracketsMock.verify();
        //logicMock.verify();
    });

    it('Real values', function () {
        var filterStr = "a1 lt 'asd' and (b1 ne 'qwe' or c1 ge 123) and d1 eq 'aas(''hello!'')'";
        var filter = new Filter(Expression, Brackets, logic);
        console.log(filterStr);

        var value = filter.parse(filterStr);
        console.log(JSON.stringify(value));

        var exp1 = value.and[0];
        var exp2 = value.and[1].or[0];
        var exp3 = value.and[1].or[1];
        var exp4 = value.and[2];

        assert.equal(exp1.field, 'a1');
        assert.equal(exp1.operator, 'lt');
        assert.equal(exp1.value, 'asd');

        assert.equal(exp2.field, 'b1');
        assert.equal(exp2.operator, 'ne');
        assert.equal(exp2.value, 'qwe');

        assert.equal(exp3.field, 'c1');
        assert.equal(exp3.operator, 'ge');
        assert.equal(exp3.value, 123);

        assert.equal(exp4.field, 'd1');
        assert.equal(exp4.operator, 'eq');
        assert.equal(exp4.value, "aas('hello!')");
    });
});