var parser = require('./lib/parser');

function QueryParser(options, provider) {
    checkOptions(options);

    options.paramName = options.paramName || 'queryData';
    this.parse = function (req, res, next) {
        try {
            req[options.paramName] = parser(req.query, options, provider);
        } catch (err) {
            return next(err);
        }
    };
}

function checkOptions(options) {
    if (!options) {
        throw new Error('Options should be set.')
    }
}

exports.QueryParser = QueryParser;
exports.mongoDbProvider = require('./lib/mongodb-provider');