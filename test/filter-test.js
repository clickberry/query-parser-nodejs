var assert = require('assert');

var Filter = require('../lib/filter');

describe('Filter Tests', function () {
    it('Real values', function () {
        var filterStr = "a1 lt 'asd' and (b1 ne 'qwe' or c1 ge 123) and d1 eq 'aas(''hello!'')'";
        var filter = new Filter(filterStr);
        console.log(filterStr);

        var value = filter.parse();
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

    it('Empty filter string', function () {
        var filter = new Filter('');

        var value = filter.parse();
        assert.equal(value.or, undefined);
        assert.equal(value.end, undefined);
    });

    it('Incorrect filter string', function () {
        var filter = new Filter('sdfg');

        assert.throws(filter.parse.bind(filter));
    });
});