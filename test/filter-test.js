var assert = require('assert');
var filter = require('../lib/filter');

describe('Logic operations', function () {
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
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(value);

        assert.equal(value, expression1);
    });

    it('AND', function () {
        var filterStr = expression1 + ' and ' + expression2;
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(value);

        assert.equal(value.and[0], expression1);
        assert.equal(value.and[1], expression2);
        assert.equal(value.or, undefined);
    });

    it('OR', function () {
        var filterStr = expression1 + ' or ' + expression2;
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(value);

        assert.equal(value.or[0], expression1);
        assert.equal(value.or[1], expression2);
        assert.equal(value.and, undefined);
    });

    it('AND & OR', function () {
        var filterStr = expression1 + ' and ' + expression2 + ' or ' + expression3;
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0].and[0], expression1);
        assert.equal(value.or[0].and[1], expression2);
        assert.equal(value.or[1], expression3);
    });

    it('AND & OR & AND & OR', function () {
        var filterStr = expression1 + ' and ' + expression2 + ' or ' + expression3 + ' and ' + expression4 + ' or ' + expression5;
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0].and[0], expression1);
        assert.equal(value.or[0].and[1], expression2);
        assert.equal(value.or[1].and[0], expression3);
        assert.equal(value.or[1].and[1], expression4);
        assert.equal(value.or[2], expression5);
    });

    it('AND & (OR)', function () {
        var filterStr = expression1 + ' and (' + expression2 + ' or ' + expression3 + ')';
        var value = filter.getLogics(filterStr);

        console.log(filterStr);
        console.log(JSON.stringify(value));

        assert.equal(value.and[0], expression1);
        assert.equal(value.and[1].or[0], expression2);
        assert.equal(value.and[1].or[1], expression3);
    });

    it('(OR) AND & OR (OR & AND)', function () {
        var filterStr = '(exp1 or exp2) and exp3 or (exp4 or exp5 and exp6)'
        var value = filter.getLogics(filterStr);

        console.log(filterStr);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0].and[0].or[0], 'exp1');
        assert.equal(value.or[0].and[0].or[1], 'exp2');
        assert.equal(value.or[0].and[1], 'exp3');
        assert.equal(value.or[1].or[0], 'exp4');
        assert.equal(value.or[1].or[1].and[0], 'exp5');
        assert.equal(value.or[1].or[1].and[1], 'exp6');
    });

    it('(OR) OR & OR (OR & AND)', function () {
        var filterStr = '(exp1 or exp2) or exp3 or (exp4 or exp5 and exp6)'
        var value = filter.getLogics(filterStr);

        console.log(filterStr);
        console.log(JSON.stringify(value));

        assert.equal(value.or[0].or[0], 'exp1');
        assert.equal(value.or[0].or[1], 'exp2');
        assert.equal(value.or[1], 'exp3');
        assert.equal(value.or[2].or[0], 'exp4');
        assert.equal(value.or[2].or[1].and[0], 'exp5');
        assert.equal(value.or[2].or[1].and[1], 'exp6');
    });

    it('(OR) AND & AND (OR & AND)', function () {
        var filterStr = '(exp1 or exp2) and exp3 and (exp4 or exp5 and exp6)'
        var value = filter.getLogics(filterStr);

        console.log(filterStr);
        console.log(JSON.stringify(value));

        assert.equal(value.and[0].or[0], 'exp1');
        assert.equal(value.and[0].or[1], 'exp2');
        assert.equal(value.and[1], 'exp3');
        assert.equal(value.and[2].or[0], 'exp4');
        assert.equal(value.and[2].or[1].and[0], 'exp5');
        assert.equal(value.and[2].or[1].and[1], 'exp6');
    });

    it('Error (AND (OR))', function () {
        var filterStr = '(exp1 and (exp2 or exp3))'
        var value = filter.getLogics(filterStr);

        console.log(filterStr);

        assert.equal(value, null);
    });

    it('Error AND ((OR))', function () {
        var filterStr = 'exp1 and ((exp2 or exp3))'
        var value = filter.getLogics(filterStr);

        console.log(filterStr);

        assert.equal(value, null);
    });

    it('Error AND (OR))', function () {
        var filterStr = 'exp1 and (exp2 or exp3))'
        var value = filter.getLogics(filterStr);

        console.log(filterStr);

        assert.equal(value, null);
    });

    it('Error', function () {
        var filterStr = "aa lt '(str)jj'"
        //var value = filter.getLogics(filterStr);

        console.log(filterStr);
        //console.log(value);




        var filterStr2 = "aa lt '(str)' and (bb lt '(s''tr)' or bb gt 's (s)j') and cc lt '(str)jj'"
        //var value2 = filter.getLogics(filterStr2);

        console.log(filterStr2);
        //console.log(value2);

        //var regExp=/((?:^|\(|\s)\w+\s(gt|lt)\s\w+(?:$|\)|\s))/g;
        //var regExp=/(\w+\s(?:gt|lt)\s(?:'[^']*'))/g;  //   |\d.?\d
        var regExp=/(\w+\s(?:gt|lt)\s'.*(?='\sand|'\sor)')/g;

        var res;
        var brackets = [];
        while ((res = regExp.exec(filterStr2)) != null) {
            var exp = res[1];

            console.log(res);
            brackets.push(exp);
        }

       console.log(brackets);
        //assert.equal(value, filterStr);
    });
});