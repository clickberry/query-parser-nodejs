function NumberParser(numberStr, maxValue) {
    this._numberStr = numberStr;
    this._maxValue = maxValue;
    this._value = null;
}

NumberParser.prototype.parse = function () {
    if (this._value) {
        return this._value;
    }

    if (!this._numberStr) {
        return {};
    }

    if (typeof(this._numberStr) !== 'string' && typeof(this._numberStr) !== 'number') {
        throw new Error('Incorrect value');
    }

    var value = parseInt(this._numberStr);
    if (isNaN(value) || value <= 0) {
        throw new Error('Incorrect value');
    }

    value = !isNaN(value) ? value : this._maxValue;
    value = value > this._maxValue ? this._maxValue : value;

    this._value = {value: value};

    return this._value;
};

module.exports = NumberParser;