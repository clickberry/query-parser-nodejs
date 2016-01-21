var assert = require('assert');
var sinon = require('sinon');

var Expression = require('../lib/expression');
var Validator = require('../lib/validator');

var validator = new Validator();

sinon.stub(validator, 'allow', function () {
});
sinon.stub(validator, 'rename', function (fieldName) {
    return fieldName;
});

//function createValidatorMock() {
//    return function () {
//        var mock = sinon.stub({
//            allow: function () {
//            },
//            rename: function () {
//            }
//        });
//
//        return mock;
//    }
//}

describe('Expression Tests', function () {
    it('Expression Template', function () {
        var filterStr = "aa lt '(str)' and (bb lt '(s'' '' tr)' or bb gt 's and (s)j') and cc lt '(str)jj'";

        var expression = new Expression(filterStr, validator);
        expression.initialize();
        var value = expression.getExpTemplate();

        assert.equal(value, 'exp0 and (exp1 or exp2) and exp3');
    });

    it('Expression incorrect operator', function () {
        var filterStr = "aa ll 'val'";

        var expression = new Expression(filterStr, validator);

        assert.throws(expression.initialize.bind(expression));
    });

    it('Expression incorrect field', function () {
        var filterStr = "aa% le 'val'";

        var expression = new Expression(filterStr);
        assert.throws(expression.initialize.bind(expression, validator));
    });

    it('Expression incorrect value', function () {
        var filterStr = "aa le 'val'kk";

        var expression = new Expression(filterStr);
        assert.throws(expression.initialize.bind(expression, validator));
    });

    it('Error Empty string', function () {
        var filterStr = "";

        var expression = new Expression(filterStr);
        assert.throws(expression.initialize.bind(expression, validator));
    });

    it('Expression incorrect expression', function () {
        var filterStr1 = "aa le 'val' and bb ii 'ss'";
        var filterStr2 = "aa le 'val' and";
        var filterStr3 = "aa le 'val' and bb";
        var filterStr4 = "aa le 'val' and bb ge 'ss";

        var expression1 = new Expression(filterStr1, validator);
        assert.throws(expression1.initialize.bind(expression1));

        var expression2 = new Expression(filterStr2, validator);
        assert.throws(expression2.initialize.bind(expression2));

        var expression3 = new Expression(filterStr3);
        assert.throws(expression3.initialize.bind(expression3, validator));

        var expression4 = new Expression(filterStr4);
        assert.throws(expression4.initialize.bind(expression4, validator));
    });

    it('Parse', function () {
        var filterStr = "aa lt '(str)'";

        var expression = new Expression(filterStr, validator);
        expression.initialize();
        var value = expression.getExp('exp0');

        assert.equal(value.operator, 'lt');
        assert.equal(value.field, 'aa');
        assert.equal(value.value, '(str)');
    });

    it('Parse quotes', function () {
        var filterStr = "bb lt '(s'' '''' '''''' tr)'";

        var expression = new Expression(filterStr, validator);
        expression.initialize();
        var value = expression.getExp('exp0');

        assert.equal(value.operator, 'lt');
        assert.equal(value.field, 'bb');
        assert.equal(value.value, "(s' '' ''' tr)");


    });

    it('Parse correct operations', function () {
        var filterStr = "aa eq 'val' and aa ne 'val' and aa gt 'val' and aa ge 'val' and aa lt 'val' and aa le 'val'";

        var expression = new Expression(filterStr, validator);
        expression.initialize();
        var value1 = expression.getExp('exp0');
        var value2 = expression.getExp('exp1');
        var value3 = expression.getExp('exp2');
        var value4 = expression.getExp('exp3');
        var value5 = expression.getExp('exp4');
        var value6 = expression.getExp('exp5');

        assert.equal(value1.operator, 'eq');
        assert.equal(value2.operator, 'ne');
        assert.equal(value3.operator, 'gt');
        assert.equal(value4.operator, 'ge');
        assert.equal(value5.operator, 'lt');
        assert.equal(value6.operator, 'le');
    });

    it('Parse Number', function () {
        var filterStr = "aa eq 10 and bb lt -5";

        var expression = new Expression(filterStr, validator);
        expression.initialize();

        var value1 = expression.getExp('exp0');
        var value2 = expression.getExp('exp1');

        assert.equal(value1.value, 10);
        assert.equal(typeof (value1.value), 'number');

        assert.equal(value2.value, -5);
        assert.equal(typeof (value2.value), 'number');
    });

    it('Parse with allow check', function () {
        var filterStr = "field1 eq 10 and field2 lt 'asd'";

        var validator1 = new Validator();
        var validator2 = new Validator();

        sinon.stub(validator1, 'allow').withArgs('field2').throws();
        sinon.stub(validator2, 'allow');

        var expression1 = new Expression(filterStr, validator1);

        assert.throws(expression1.initialize.bind(expression1));
    });

    it('Parse with field rename', function () {
        var filterStr = "field1 eq 10 and field2 lt 'asd'";
        var validator = new Validator();

        sinon.stub(validator, 'allow');
        var stub = sinon.stub(validator, 'rename');
        stub.withArgs('field1').returns('field1');
        stub.withArgs('field2').returns('newFieldName');

        var expression = new Expression(filterStr, validator);
        expression.initialize();
        var value1 = expression.getExp('exp0');
        var value2 = expression.getExp('exp1');

        assert.equal(value1.field, 'field1');
        assert.equal(value2.field, 'newFieldName');
    });
});