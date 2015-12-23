function Expression(filterStr) {
    this._filterStr = filterStr;
}

Expression.prototype.initialize = function (callback) {
    var self = this;
    callback = callback || function (err) {
            if (err) {
                throw err;
            }
        };

    self._expTemplate = '';
    self._expressions = {};

    var regExp = /([\w$_\-]+)\s(eq|ne|gt|ge|lt|le)\s('(?:[^']*(?:'')*[^']*)*'|-?\d+)/g;

    var expTemplate = self._filterStr;
    var expressions = {};

    var res;
    var match = [];

    while ((res = regExp.exec(self._filterStr)) != null) {
        var exp = res[0];
        var obj = {
            field: res[1],
            operator: res[2],
            value: getValue(res[3])
        };
        match.push({exp: exp, obj: obj});
    }

    match.forEach(function (item, index) {
        var key = 'exp' + index;
        expTemplate = expTemplate.replace(item.exp, key);
        expressions[key] = item.obj;
    });

    var check = checkExpTemplate(expTemplate);
    if (!check) {
        return callback(new Error('Incorrect expressions.'));
    }

    self._expTemplate = expTemplate;
    self._expressions = expressions;

    callback(null);
};

Expression.prototype.getExpressions = function () {
    return this._expressions;
};

Expression.prototype.getExpTemplate = function () {
    return this._expTemplate;
};

Expression.prototype.getExp = function (expKey) {
    return this._expressions[expKey];
};

function getValue(str) {
    var value = parseInt(str) || str;
    if (typeof (value) === 'number') {
        return value;
    }

    str = str.replace(/'(?!')/g, '');
    str = str.replace(/''/g, '\'');

    return str;
}

function checkExpTemplate(expTemplate) {
    var regExp = /^((\(*)exp\d+(\)*\sand\s(?!$)|\)*\sor\s(?!$)|\)*))+$/g;
    return regExp.test(expTemplate);
}

module.exports = Expression;