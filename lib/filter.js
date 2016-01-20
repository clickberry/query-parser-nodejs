var Expression = require('../lib/expression');
var Brackets = require('../lib/brackets');
var logic = require('../lib/logic');

function Filter(filterStr, options) {
    this._filterStr = filterStr;
    this._options = options;
    this._obj = null;
}

Filter.prototype.parse = function () {
    if (!this._filterStr) {
        return {};
    }

    if (this._obj) {
        return this._obj;
    }

    var expression = new Expression(this._filterStr, this._options);
    try {
        expression.initialize();
    }
    catch (err) {
        throw err;
    }
    var expTemplate = expression.getExpTemplate();
    console.log(expTemplate);

    var brackets = new Brackets(expTemplate);
    brackets.initialize();
    var brcTemplate = brackets.getBrcTemplate();
    console.log(brcTemplate);

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