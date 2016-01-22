var Filter = require('./filter');
var OrderBy = require('./order-by');
var NumberParser = require('./number-parser');
var Validator = require('./validator');

module.exports = function (query, options, provider) {
    var filterValidator = new Validator(options.filter);
    var orderByValidator = new Validator(options.orderBy);

    var filter = new Filter(query.$filter, filterValidator);
    var orderBy = new OrderBy(query.$orderby, orderByValidator);
    var top = new NumberParser(query.$top, options.maxTop);
    var skip = new NumberParser(query.$skip, options.maxSkip);

    var obj = {
        filter: filter.parse(),
        orderBy: orderBy.parse(),
        top: top.parse(),
        skip: skip.parse()
    };

    return provider.parse(obj);
};