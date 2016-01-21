var assert = require('assert');
var sinon = require('sinon');

var OrderBy = require('../lib/order-by');
var Validator = require('../lib/validator');

var validator = new Validator();
sinon.stub(validator, 'allow');
sinon.stub(validator, 'rename', function (fieldName) {
    return fieldName
});

describe('OrderBy Tests', function () {
    it('Parse asc & desc', function () {
        var orderByStr = 'field1 asc,field2 desc';
        var orderBy = new OrderBy(orderByStr, validator);
        var value = orderBy.parse();

        assert.equal(value.field1, 'asc');
        assert.equal(value.field2, 'desc');
    });

    it('Parse without direction string', function () {
        var orderByStr = 'field1,field2';
        var orderBy = new OrderBy(orderByStr, validator);
        var value = orderBy.parse();

        assert.equal(value.field1, 'asc');
        assert.equal(value.field2, 'asc');
    });

    it('Parse complicated string', function () {
        var orderByStr = '  field1  desc ,  field2    desc';
        var orderBy = new OrderBy(orderByStr, validator);

        var value = orderBy.parse();

        assert.equal(value.field1, 'desc');
        assert.equal(value.field2, 'desc');
    });

    it('Parse Incorrect format Error', function () {
        var orderByStr1 = ',';
        var orderByStr2 = 'field1 desc field2';
        var orderByStr3 = 'field1 desc, field2 aa';

        var orderBy1 = new OrderBy(orderByStr1, validator);
        var orderBy2 = new OrderBy(orderByStr2, validator);
        var orderBy3 = new OrderBy(orderByStr3, validator);

        assert.throws(orderBy1.parse.bind(orderBy1), 'Error orderByStr1.');
        assert.throws(orderBy2.parse.bind(orderBy2), 'Error orderByStr2.');
        assert.throws(orderBy3.parse.bind(orderBy3), 'Error orderByStr3.');
    });

    it('Parse with allow check', function () {
        var orderByStr = "field1 desc, field2 desc";

        var validator = new Validator();
        sinon.stub(validator, 'allow').withArgs('field2').throws();

        var orderBy = new OrderBy(orderByStr, validator);

        assert.throws(orderBy.parse.bind(orderBy));
    });

    it('Parse with field rename', function () {
        var orderByStr = "field1 desc, field2 desc";
        var validator = new Validator();

        var stub = sinon.stub(validator, 'rename');
        stub.withArgs('field1').returns('field1');
        stub.withArgs('field2').returns('newFieldName');
        sinon.stub(validator, 'allow');

        var orderBy = new OrderBy(orderByStr, validator);
        var value = orderBy.parse();

        assert.equal(value.field1, 'desc');
        assert.equal(value.newFieldName, 'desc');
    });
});