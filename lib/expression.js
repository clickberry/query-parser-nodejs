function Expression(filterStr, validator) {
    this._filterStr = filterStr;
    this._validator = validator;
}

Expression.prototype.initialize = function () {
    var self = this;

    self._expTemplate = '';
    self._expressions = {};

    var regExp = /([\w$_\-]+)\s(eq|ne|gt|ge|lt|le)\s('(?:[^']*(?:'')*[^']*)*'|-?\d+)/g;

    var expTemplate = self._filterStr;
    var expressions = {};

    var res;
    var match = [];

    while ((res = regExp.exec(self._filterStr)) != null) {
        var exp = res[0];
        var fieldName = res[1];
        var operator = res[2];
        var value = res[3];

        this._validator.allow(fieldName);

        var obj = {
            field: this._validator.rename(fieldName),
            operator: operator,
            value: getValue(value)
        };

        //
        //if (this._options && !this._options[obj.field]) {
        //    throw new Error('Field \'' + obj.field + '\' is not allowed.')
        //}

        match.push({exp: exp, obj: obj});
    }

    match.forEach(function (item, index) {
        var key = 'exp' + index;
        expTemplate = expTemplate.replace(item.exp, key);
        expressions[key] = item.obj;
    });

    var check = checkExpTemplate(expTemplate);
    if (!check) {
        throw new Error('Incorrect expressions.');
    }

    self._expTemplate = expTemplate;
    self._expressions = expressions;
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