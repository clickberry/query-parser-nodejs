var parser = require('./lib/parser');

function QueryParser(options, provider) {
    this.parse = function (req, res, next) {
        try {
            return parser(req.query, options, provider);
        } catch (err) {
            return next(err);
        }
    };
}


module.exports = QueryParser;