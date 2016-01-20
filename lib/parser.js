var Filter = require('./filter');
var OrderBy = require('./order-by');
var Top = require('./top');

module.exports = function (query, options, provider) {
    var filter = new Filter(query.$filter, options.filter);
    var orderBy = new OrderBy(query.$orderby, options.orderBy);
    var top = new Top(query.$top);

    return provider.parse(filter, orderBy, top);
};