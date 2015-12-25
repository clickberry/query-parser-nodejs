function Brackets(expTemplate) {
    this.expTemplate = expTemplate;
}

Brackets.prototype.initialize = function () {
    this._brcTemplate = '';
    this._brackets = {};

    var notExistBrackets = /^[^()]+$/;
    var existBarackets = /^([^()]*\([^()]+\)[^()]*)+$/;

    var brcTemplate = this.expTemplate;
    var brackets = {};

    var check = notExistBrackets.test(this.expTemplate) || existBarackets.test(this.expTemplate);

    if (!check) {
        return new Error('Incorrect filter format.');
    }

    var regExpBracket = /\(([^()]+)\)/g;

    var res;
    var match = [];

    while ((res = regExpBracket.exec(this.expTemplate)) != null) {
        var exp = res[1];
        match.push(exp);
    }

    match.forEach(function (exp, index) {
        var key = 'brc' + index;
        brcTemplate = brcTemplate.replace('(' + exp + ')', key);
        brackets[key] = exp;
    });

    this._brcTemplate = brcTemplate;
    this._brackets = brackets;
};

Brackets.prototype.getBrcTemplate = function () {
    return this._brcTemplate;
};

Brackets.prototype.getBrc = function (expKey) {
    return this._brackets[expKey];
};

module.exports=Brackets;