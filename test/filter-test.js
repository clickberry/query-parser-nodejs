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
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(value);

            assert.equal(value, expression1);
        });
    });

    it('AND', function () {
        var filterStr = expression1 + ' and ' + expression2;
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(value);

            assert.equal(value.and[0], expression1);
            assert.equal(value.and[1], expression2);
            assert.equal(value.or, undefined);
        });
    });

    it('OR', function () {
        var filterStr = expression1 + ' or ' + expression2;
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(value);

            assert.equal(value.or[0], expression1);
            assert.equal(value.or[1], expression2);
            assert.equal(value.and, undefined);
        });
    });

    it('AND & OR', function () {
        var filterStr = expression1 + ' and ' + expression2 + ' or ' + expression3;
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.or[0].and[0], expression1);
            assert.equal(value.or[0].and[1], expression2);
            assert.equal(value.or[1], expression3);
        });
    });

    it('AND & OR & AND & OR', function () {
        var filterStr = expression1 + ' and ' + expression2 + ' or ' + expression3 + ' and ' + expression4 + ' or ' + expression5;
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.or[0].and[0], expression1);
            assert.equal(value.or[0].and[1], expression2);
            assert.equal(value.or[1].and[0], expression3);
            assert.equal(value.or[1].and[1], expression4);
            assert.equal(value.or[2], expression5);
        });
    });

    it('AND & (OR)', function () {
        var filterStr = expression1 + ' and (' + expression2 + ' or ' + expression3 + ')';
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.and[0], expression1);
            assert.equal(value.and[1].or[0], expression2);
            assert.equal(value.and[1].or[1], expression3);
        });
    });

    it('(OR) AND & OR (OR & AND)', function () {
        var filterStr = '(exp1 or exp2) and exp3 or (exp4 or exp5 and exp6)'
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.or[0].and[0].or[0], 'exp1');
            assert.equal(value.or[0].and[0].or[1], 'exp2');
            assert.equal(value.or[0].and[1], 'exp3');
            assert.equal(value.or[1].or[0], 'exp4');
            assert.equal(value.or[1].or[1].and[0], 'exp5');
            assert.equal(value.or[1].or[1].and[1], 'exp6');
        });
    });

    it('(OR) OR & OR (OR & AND)', function () {
        var filterStr = '(exp1 or exp2) or exp3 or (exp4 or exp5 and exp6)'
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.or[0].or[0], 'exp1');
            assert.equal(value.or[0].or[1], 'exp2');
            assert.equal(value.or[1], 'exp3');
            assert.equal(value.or[2].or[0], 'exp4');
            assert.equal(value.or[2].or[1].and[0], 'exp5');
            assert.equal(value.or[2].or[1].and[1], 'exp6');
        });
    });

    it('(OR) AND & AND (OR & AND)', function () {
        var filterStr = '(exp1 or exp2) and exp3 and (exp4 or exp5 and exp6)'
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);
            console.log(JSON.stringify(value));

            assert.equal(value.and[0].or[0], 'exp1');
            assert.equal(value.and[0].or[1], 'exp2');
            assert.equal(value.and[1], 'exp3');
            assert.equal(value.and[2].or[0], 'exp4');
            assert.equal(value.and[2].or[1].and[0], 'exp5');
            assert.equal(value.and[2].or[1].and[1], 'exp6');
        });
    });

    it('Error (AND (OR))', function () {
        var filterStr = '(exp1 and (exp2 or exp3))'
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);

            assert.ok(err);
        });


    });

    it('Error AND ((OR))', function () {
        var filterStr = 'exp1 and ((exp2 or exp3))'
        filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);

            assert.ok(err);
        });
    });

    it('Error AND (OR))', function () {
        var filterStr = 'exp1 and (exp2 or exp3))'
        var value = filter.getLogics(filterStr, function(err, value){
            console.log(filterStr);

            assert.ok(err);
        });
    });

    it('***Temporary***', function () {
        var filterStr = "aa lt '(str)jj'";

        console.log(filterStr);

        var filterStr2 = "aa lt '(str)' and (bb lt '(s'' ''tr)' or bb gt 's and (s)j') and cc lt '(str)jj''";
        console.log(filterStr2);

        filterStr2 = " 'a' 'b ''dd'' c' '''bb''' ''";

        var ss = filterStr2;
        var ss2 = filterStr2;
        var arr = [];
        var str = '';
        var isStr = false;
        var index = 0;
        while (index < filterStr2.length) {
            var val = filterStr2[index];
            if (val == '\'') {
                var next = filterStr2[index + 1];

                if (!isStr) {
                    str = val;
                    isStr = true;
                } else if (next == '\'') {
                    str += val;
                    str += next;
                    index++;
                } else {
                    str += val;
                    isStr = false;
                    arr.push(str);
                }
            } else if (isStr) {
                str += val;
            }

            index++;
        }

        console.log('---------arr---------');
        console.log(arr);

        console.log(ss2);
        arr.forEach(function (item, i) {
            console.log(item);
            ss = ss.replace(item, i.toString())
            console.log(ss);
        });

        console.log(ss);
    });
});