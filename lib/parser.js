var Filter = require('./filter');
var OrderBy = require('./order-by');
var Top = require('./top');
var Validator = require('./validator');

module.exports = function (query, options, provider) {
    var filterValidator = new Validator(options.filter);
    var orderByValidator = new Validator(options.orderBy);

    var filter = new Filter(query.$filter, filterValidator);
    var orderBy = new OrderBy(query.$orderby, orderByValidator);
    var top = new Top(query.$top);

    return provider.parse(filter, orderBy, top);
};