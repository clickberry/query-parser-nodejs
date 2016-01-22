var assert = require('assert');
var sinon = require('sinon');

var OrderBy = require('../lib/order-by');
var Validator = require('../lib/validator');

function createValidator() {
    var validator = new Validator();
    sinon.stub(validator, 'allow');
    sinon.stub(validator, 'duplicate');
    sinon.stub(validator, 'rename', function (fieldName) {
        return fieldName;
    });

    return validator;
}

describe('OrderBy Tests', function () {
    it('Parse asc & desc', function () {
        var orderByStr = 'field1 asc,field2 desc';
        var validator = createValidator();
        var orderBy = new OrderBy(orderByStr, validator);
        var value = orderBy.parse();

        assert.equal(value[0].field, 'field1');
        assert.equal(value[0].direction, 'asc');
        assert.equal(value[1].field, 'field2');
        assert.equal(value[1].direction, 'desc');
    });

    it('Parse without direction string', function () {
        var orderByStr = 'field1,field2';
        var validator = createValidator();
        var orderBy = new OrderBy(orderByStr, validator);
        var value = orderBy.parse();

        assert.equal(value[0].direction, 'asc');
        assert.equal(value[1].direction, 'asc');
    });

    it('Parse complicated string', function () {
        var orderByStr = '  field1  desc ,  field2    asc';
        var validator = createValidator();
        var orderBy = new OrderBy(orderByStr, validator);

        var value = orderBy.parse();

        assert.equal(value[0].field, 'field1');
        assert.equal(value[0].direction, 'desc');
        assert.equal(value[1].field, 'field2');
        assert.equal(value[1].direction, 'asc');
    });

    it('Parse Incorrect format Error', function () {
        var orderByStr1 = ',';
        var orderByStr2 = 'field1 desc field2';
        var orderByStr3 = 'field1 desc, field2 aa';

        var validator1 = createValidator();
        var validator2 = createValidator();
        var validator3 = createValidator();

        var orderBy1 = new OrderBy(orderByStr1, validator1);
        var orderBy2 = new OrderBy(orderByStr2, validator2);
        var orderBy3 = new OrderBy(orderByStr3, validator3);

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

    it('Parse with duplicate fields', function () {
        var orderByStr = "field1, field1 desc";
        var validator = new Validator();
        var orderBy = new OrderBy(orderByStr, validator);

        assert.throws(orderBy.parse.bind(orderBy), 'Error duplicate fields.');
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

        assert.equal(value[0].field, 'field1');
        assert.equal(value[1].field, 'newFieldName');
    });
});