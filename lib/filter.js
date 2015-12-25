function Filter(Expression, Brackets, logic) {
    this.Expression = Expression;
    this.Brackets = Brackets;
    this.logic = logic;
}

Filter.prototype.parse = function (filterStr) {
    var self = this;
    var expression = new self.Expression(filterStr);
    expression.initialize();
    var expTemplate = expression.getExpTemplate();
    console.log(expTemplate);

    var brackets = new self.Brackets(expTemplate);
    brackets.initialize();
    var brcTemplate = brackets.getBrcTemplate();
    console.log(brcTemplate);

    var func = function (exp) {
        var brc = brackets.getBrc(exp);
        if (brc) {
            return self.logic.parse(brc, func);
        }

        return expression.getExp(exp);
    };

    var obj = self.logic.parse(brcTemplate, func);

    return obj;
};

module.exports = Filter;