var assert = require('assert');
var Validator = require('../lib/validator');

describe('Validator Tests', function () {
    it('Allow fields', function () {
        var options = {
            field1: {
                allow: true,
            }
        };
        var validator = new Validator(options);

        validator.allow('field1'); //ok
        assert.throws(function () {
            validator.allow('field2');
        });
    });

    it('Rename fields', function () {
        var options = {
            field1: {
                rename: 'f1'
            }, field2: {
                rename: 'f2'
            }
        };
        var validator = new Validator(options);

        var value1 = validator.rename('field1');
        var value2 = validator.rename('field2');
        var value3 = validator.rename('field3');

        assert.equal(value1, 'f1');
        assert.equal(value2, 'f2');
        assert.equal(value3, 'field3');
    });
});