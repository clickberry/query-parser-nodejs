function Top(topStr) {
    this.topStr = topStr;
    this._value = null;
}

Top.prototype.parse = function () {
    if (!this.topStr) {
        return 0;
    }

    if (this._value) {
        return this._value;
    }

    var value = parseInt(this.topStr);
    this._value = !isNaN(value) ? value : 0;

    return this._value;
};

module.exports = Top;