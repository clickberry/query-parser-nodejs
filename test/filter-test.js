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

        assert.equal(value.exp, expression1);
        assert.equal(value.and, undefined);
        assert.equal(value.or, undefined);
    });

    it('AND', function () {
        var filterStr = expression1 + ' and ' + expression2;
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(value);

        assert.equal(value.and[0], expression1);
        assert.equal(value.and[1], expression2);
        assert.equal(value.exp, undefined);
        assert.equal(value.or, undefined);
    });

    it('OR', function () {
        var filterStr = expression1 + ' or ' + expression2;
        var value = filter.getLogics(filterStr);
        console.log(filterStr);
        console.log(value);

        assert.equal(value.or[0], expression1);
        assert.equal(value.or[1], expression2);
        assert.equal(value.exp, undefined);
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
        //var filterStr = expression1 + ' and ' + expression2 + ' or ' + expression3+'';
        //var value = filter.getLogics(filterStr);
        //console.log(filterStr);
        //console.log(JSON.stringify(value));


        var filterStr = '(exp1 or exp2) and (exp3 or exp 4)';
        console.log(filterStr);

        var regExpOr = /[^(\s]* or [^)\s]*/g;
        var res1 = filterStr.match(regExpOr);
        console.log(res1);

        var regExpAnd = /[^(\s]* and [^)\s]*/g;
        var res2 = filterStr.match(regExpAnd);
        console.log(res2);

        //var regExpBracket = /\([^\s]* or [^\s]*\)+/g;
        var regExpBracket = /\(([^)]+)\)/g;
        var res3;

        var brackets=[];
        var count=0;
        while((res3=regExpBracket.exec(filterStr))!=null){
            console.log(res3);
            var bracket=res3[0];
            var exp=res3[1];

            brackets.push(exp);
            //filterStr.replace(new RegExp('\\('+exp+'\\)', 'g'), count.toString());
            //count++;
        }

        brackets.forEach(function(exp, index){
            filterStr=filterStr.replace('('+exp+')', index);
        });

        console.log(brackets);
        console.log(filterStr);


        //assert.equal(value.and[1], expression1);
        //assert.equal(value.and[1].or[0], expression2);
        //assert.equal(value.and[1].or[1], expression3);

    });
});