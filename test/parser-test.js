var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

var provider = require('../lib/mongodb-provider');
var parser = require('../lib/parser');

describe('Parser Tests', function () {
    it('Parse query string for MongoDB', function () {
        var query = {
            $filter: "field1 gt 10 and field2 lt 'abc'",
            $orderby: 'field3, field4 desc',
            $skip: 55,
            $top: 66
        };

        var options = {
            paramName: 'myParam',
            filter: {
                field1: {
                    allow: true
                },
                field2: {
                    allow: true,
                    rename: 'newField2'
                }
            },
            orderBy: {
                field3: {
                    allow: true,
                    rename: 'newField3'
                },
                field4: {
                    allow: true
                }
            },
            maxTop: 100,
            maxSkip: 200
        };

        var value = parser(query, options, provider);

        value.query['$and'][0]['field1']['$gt'].should.equal(10);
        value.query['$and'][1]['newField2']['$lt'].should.equal('abc');

        value.sort['newField3'].should.equal(1);
        value.sort['field4'].should.equal(-1);

        value.skip.should.equal(55);
        value.limit.should.equal(66);

    });
});