var Expression = require('../lib/expression');
var Brackets = require('../lib/brackets');
var logic = require('../lib/logic');

function Filter(filterStr, validator) {
    this._filterStr = filterStr;
    this._validator = validator;
    this._obj = null;
}

Filter.prototype.parse = function () {
    if (!this._filterStr) {
        return {};
    }

    if (this._obj) {
        return this._obj;
    }

    var expression = new Expression(this._filterStr, this._validator);
    try {
        expression.initialize();
    }
    catch (err) {
        throw err;
    }
    var expTemplate = expression.getExpTemplate();

    var brackets = new Brackets(expTemplate);
    brackets.initialize();

    var brcTemplate = brackets.getBrcTemplate();

    var func = function (exp) {
        var brc = brackets.getBrc(exp);
        if (brc) {
            return logic.parse(brc, func);
        }

        return expression.getExp(exp);
    };

    this._obj = logic.parse(brcTemplate, func);

    return this._obj;
};

module.exports = Filter;