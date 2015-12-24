var assert = require('assert');
var Expression = require('../lib/expression');

describe('Expression', function () {
    it('Expression Template', function () {
        var filterStr = "aa lt '(str)' and (bb lt '(s'' '' tr)' or bb gt 's and (s)j') and cc lt '(str)jj'";

        var expression = new Expression(filterStr);
        expression.initialize(function (err) {

        });
        var value = expression.getExpTemplate();
        console.log(filterStr);
        console.log(value);

        assert.equal(value, 'exp0 and (exp1 or exp2) and exp3');
    });

    it('Expression incorrect operator', function () {
        var filterStr = "aa ll 'val'";
        console.log(filterStr);

        var expression = new Expression(filterStr);
        expression.initialize(function (err) {
            assert.ok(err);
        });

        try {
            expression.initialize();
        }
        catch (err) {
            assert.ok(err);
        }
    });

    it('Expression incorrect field', function () {
        var filterStr = "aa% le 'val'";
        console.log(filterStr);

        var expression = new Expression(filterStr);
        expression.initialize(function (err) {
            assert.ok(err);
        });
    });

    it('Expression incorrect value', function () {
        var filterStr = "aa le 'val'kk";
        console.log(filterStr);

        var expression = new Expression(filterStr);
        expression.initialize(function (err) {
            assert.ok(err);
        });
    });

    it('Expression incorrect expression', function () {
        var filterStr1 = "aa le 'val' and bb ii 'ss'";
        var filterStr2 = "aa le 'val' and";
        var filterStr3 = "aa le 'val' and bb";
        var filterStr4 = "aa le 'val' and bb ge 'ss";

        var expression1 = new Expression(filterStr1);
        expression1.initialize(function (err) {
            assert.ok(err);
        });

        var expression2 = new Expression(filterStr2);
        expression2.initialize(function (err) {
            assert.ok(err);
        });

        var expression3 = new Expression(filterStr3);
        expression3.initialize(function (err) {
            assert.ok(err);
        });

        var expression4 = new Expression(filterStr4);
        expression4.initialize(function (err) {
            assert.ok(err);
        });
    });

    it('Parse', function () {
        var filterStr = "aa lt '(str)'";

        var expression = new Expression(filterStr);
        expression.initialize();
        var value = expression.getExp('exp0');
        console.log(filterStr);
        console.log(value);

        assert.equal(value.operator, 'lt');
        assert.equal(value.field, 'aa');
        assert.equal(value.value, '(str)');
    });

    it('Parse quotes', function () {
        var filterStr = "bb lt '(s'' '''' '''''' tr)'";

        var expression = new Expression(filterStr);
        expression.initialize();
        var value = expression.getExp('exp0');
        console.log(filterStr);
        console.log(value);

        assert.equal(value.operator, 'lt');
        assert.equal(value.field, 'bb');
        assert.equal(value.value, "(s' '' ''' tr)");


    });

    it('Parse correct operations', function () {
        var filterStr = "aa eq 'val' and aa ne 'val' and aa gt 'val' and aa ge 'val' and aa lt 'val' and aa le 'val'";
        console.log(filterStr);

        var expression = new Expression(filterStr);
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
        console.log(filterStr);

        var expression = new Expression(filterStr);
        expression.initialize(function (err) {
            var value1 = expression.getExp('exp0');
            var value2 = expression.getExp('exp1');

            assert.equal(err, null);
            assert.equal(value1.value, 10);
            assert.equal(typeof (value1.value), 'number');

            assert.equal(value2.value, -5);
            assert.equal(typeof (value2.value), 'number');
        });
    });
});