var assert = require('assert');
var Top = require('../lib/top');

describe('Top Tests', function () {
    it('Parse Number', function () {
        var topStr = '12';
        var top = new Top(topStr);
        var value = top.parse();

        assert.equal(typeof(value), 'number');
        assert.equal(value, 12);
    });

    it('Parse String', function () {
        var topStr = 'abc';
        var top = new Top(topStr);
        var value = top.parse();

        assert.equal(typeof(value), 'number');
        assert.equal(value, 0);
    });

    it('Parse undefined', function () {
        var top = new Top();
        var value = top.parse();

        assert.equal(typeof(value), 'number');
        assert.equal(value, 0);
    });

});