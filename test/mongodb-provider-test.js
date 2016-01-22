var assert = require('assert');
var provider = require('../lib/mongodb-provider');

describe('MongoDB Provider Tests', function () {
    it('Parse empty', function () {
        var obj = {
            filter: {},
            orderBy: {},
            skip: {},
            top: {}
        };

        var value1 = provider.parse(obj);
        var value2 = provider.parse({});

        assert.equal(value1.query, undefined);
        assert.equal(value1.sort, undefined);
        assert.equal(value1.skip, undefined);
        assert.equal(value1.top, undefined);

        assert.equal(value2.query, undefined);
        assert.equal(value2.sort, undefined);
        assert.equal(value1.skip, undefined);
        assert.equal(value1.top, undefined);
    });

    it('Parse Filter expression', function () {
        var obj = {
            filter: {
                field: 'field1',
                operator: 'gt',
                value: 12
            }, orderBy: {}
        };

        var value = provider.parse(obj);

        assert.equal(value.query['field1']['$gt'], 12);
    });

    it('Parse Filter', function () {
        var obj = {
            filter: {
                or: [{
                    and: [{
                        field: 'field1',
                        operator: 'gt',
                        value: 12
                    }, {
                        field: 'field2',
                        operator: 'gte',
                        value: 'abc'
                    }]
                }, {
                    and: [{
                        field: 'field3',
                        operator: 'eq',
                        value: 'qwe'
                    }, {
                        field: 'field4',
                        operator: 'lt',
                        value: 56
                    }]
                }
                ]
            }
        };

        var value = provider.parse(obj);

        assert.equal(value.query['$or'][0]['$and'][0]['field1']['$gt'], 12);
        assert.equal(value.query['$or'][0]['$and'][1]['field2']['$gte'], 'abc');
        assert.equal(value.query['$or'][1]['$and'][0]['field3']['$eq'], 'qwe');
        assert.equal(value.query['$or'][1]['$and'][1]['field4']['$lt'], 56);
    });

    it('Parse OrderBy', function () {
        var obj = {
            orderBy: [{
                field: 'field1',
                direction: 'asc'
            }, {
                field: 'field2',
                direction: 'desc'
            }]
        };

        var value = provider.parse(obj);

        assert.equal(value.sort['field1'], 1);
        assert.equal(value.sort['field2'], -1);
    });

    it('Parse Top & Skip', function () {
        var obj = {
            top: {value: 11},
            skip: {value: 22}
        };

        var value = provider.parse(obj);

        assert.equal(value.limit, 11);
        assert.equal(value.skip, 22);
    });
});