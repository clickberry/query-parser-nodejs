var assert = require('assert');
var Expression = require('../lib/expression');

describe('Expression', function(){
    it('Expression Template', function () {
        var filterStr = "aa lt '(str)' and (bb lt '(s'' '' tr)' or bb gt 's and (s)j') and cc lt '(str)jj'";

        var expression=new Expression(filterStr);
        var value=expression.getExpTemplate();

        console.log(filterStr);
        console.log(value);

        assert.equal(value, 'exp0 and (exp1 or exp2) and exp3');
    });

    it('Parse', function () {
        var filterStr = "aa lt '(str)'";

        var expression=new Expression(filterStr);
        var value1=expression.parse('exp0');

        console.log(filterStr);
        console.log(value1);

        assert.equal(value1.operator, 'lt');
        assert.equal(value1.field, 'aa');
        assert.equal(value1.value, '(str)');
    });

    it('Parse quotes', function () {
        var filterStr = "bb lt '(s'' '''' '''''' tr)'";

        var expression=new Expression(filterStr);
        var value1=expression.parse('exp0');

        console.log(filterStr);
        console.log(value1);

        assert.equal(value1.operator, 'lt');
        assert.equal(value1.field, 'bb');
        assert.equal(value1.value, "(s' '' ''' tr)");
    });
});