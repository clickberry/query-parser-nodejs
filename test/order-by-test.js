var assert = require('assert');
var OrderBy = require('../lib/order-by');

describe('OrderBy Tests', function () {
    it('Parse asc & desc', function () {
        var orderByStr = 'field1 asc,field2 desc';
        var orderBy = new OrderBy(orderByStr);
        var value = orderBy.parse();

        assert.equal(value.field1, 'asc');
        assert.equal(value.field2, 'desc');
    });

    it('Parse without direction string', function () {
        var orderByStr = 'field1,field2';
        var orderBy = new OrderBy(orderByStr);
        var value = orderBy.parse();

        assert.equal(value.field1, 'asc');
        assert.equal(value.field2, 'asc');
    });

    it('Parse complicated string', function () {
        var orderByStr = '  field1  desc ,  field2    desc';
        var orderBy = new OrderBy(orderByStr);

        var value = orderBy.parse();

        assert.equal(value.field1, 'desc');
        assert.equal(value.field2, 'desc');
    });

    it('Parse Incorrect format Error', function () {
        var orderByStr1 = ',';
        var orderByStr2 = 'field1 desc field2';
        var orderByStr3 = 'field1 desc, field2 aa';

        var orderBy1 = new OrderBy(orderByStr1);
        var orderBy2 = new OrderBy(orderByStr2);
        var orderBy3 = new OrderBy(orderByStr3);

        assert.throws(orderBy1.parse.bind(orderBy1), 'Error orderByStr1.');
        assert.throws(orderBy2.parse.bind(orderBy2), 'Error orderByStr2.');
        assert.throws(orderBy3.parse.bind(orderBy3), 'Error orderByStr3.');
    });

    it('Parse with options', function () {
        var orderByStr = 'field1 desc, field2 desc';
        var options1 = {field1: true};
        var options2 = {field1: true, field2: true};

        var orderBy1 = new OrderBy(orderByStr, options1);
        var orderBy2 = new OrderBy(orderByStr, options2);

        assert.throws(orderBy1.parse.bind(orderBy1), 'Error orderByStr.');
        orderBy2.parse(); //ok
    });

    it('Parse map field name', function () {
        var orderByStr = 'field1 desc, field2 desc';
        var options = {
            field1: {
                allow: true,
                map: 'f1'
            }, field2: {
                allow: true,
                map: 'f2'
            }
        };

        var orderBy = new OrderBy(orderByStr, options);
        var value = orderBy.parse();
        console.log(value);
        assert.equal(value.f1, 'desc');
        assert.equal(value.f2, 'desc')
    });
});