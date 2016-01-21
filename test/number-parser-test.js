var assert = require('assert');
var NumberParser = require('../lib/number-parser');

describe('Number Tests', function () {
    it('Parse Number', function () {
        var numberParser = new NumberParser(12, 100);
        var value = numberParser.parse();

        assert.equal(typeof(value.value), 'number');
        assert.equal(value.value, 12);
    });

    it('Parse not a Number', function () {
        var numberParser1 = new NumberParser('abc', 22);
        var numberParser2 = new NumberParser({}, 22);

        assert.throws(numberParser1.parse.bind(numberParser1));
        assert.throws(numberParser2.parse.bind(numberParser2));
    });

    it('Parse undefined', function () {
        var numberParser = new NumberParser(undefined, 100);
        var value = numberParser.parse();

        assert.equal(typeof(value.value), 'undefined');
        assert.equal(value.value, undefined);
    });

    it('Parse value great then maxTop', function () {
        var numberStr = '1000';
        var numberParser = new NumberParser(numberStr, 33);
        var value = numberParser.parse();

        assert.equal(value.value, 33);
    });

    it('Parse negative value', function () {
        var numberStr = '-12';
        var numberParser = new NumberParser(numberStr, 66);

        assert.throws(numberParser.parse.bind(numberParser));
    });

    it('Parse 0 value', function () {
        var numberStr = '0';
        var numberParser = new NumberParser(numberStr, 77);

        assert.throws(numberParser.parse.bind(numberParser));
    });
});