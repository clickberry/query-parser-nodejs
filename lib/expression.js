function Expression(filterStr) {
    var self = this;
    var regExp = /[\w$_\-]+\s(?:lt|gt)\s'(?:[^']*(?:'')*[^']*)*'/g;

    var match = filterStr.match(regExp);
    self._expTemplate = filterStr;
    self._expressions = {};

    match.forEach(function (exp, index) {
        var key = 'exp' + index;
        self._expTemplate = self._expTemplate.replace(exp, key);
        self._expressions[key] = exp;
    });
}

Expression.prototype.getExpressions = function () {
    return this._expressions;
};

Expression.prototype.getExpTemplate = function () {
    return this._expTemplate;
};

Expression.prototype.parse = function (expKey) {
    var expStr = this._expressions[expKey];
    var regExp = /([\w$_\-]+)\s(lt|gt)\s(.*)/g;
    var res = regExp.exec(expStr);
    var value=getValue(res[3]);
    return {
        field: res[1],
        operator: res[2],
        value:value
    };
};

function getValue(str){
    //return str.replace(/'(?!'+)/g, '')
    console.log(str);
    str = str.replace(/'(?!')/g, '')
    console.log(str);
    str = str.replace(/''/g, '\'')
    console.log(str);

    return str;
}

module.exports = Expression;