function OrderBy(orderbyStr, options) {
    this._orderbyStr = orderbyStr;
    this._options = options;
    this._obj = null;
}

OrderBy.prototype.parse = function () {
    if (!this._orderbyStr) {
        return {};
    }

    if (this._obj) {
        return this._obj;
    }

    var orderByStr = this._orderbyStr;
    var obj = {};

    var regExp = /^\s*([\w]+)(?:\s+(asc|desc)?)?\s*$/;
    var fields = orderByStr.split(',');
    var options = this._options;

    fields.forEach(function (item) {
        var matches = item.match(regExp)
        console.log(matches);
        if (!matches) {
            throw new Error('OrderBy incorrect format.');
        }

        var fieldName = matches[1];
        var direction = matches[2];

        if (options && !options[fieldName]) {
            throw new Error('Field \'' + fieldName + '\' is not allowed.');
        }

        obj[fieldName] = direction || 'asc';
    });

    return this._obj = obj;
};

function validate(obj, options) {

}

module.exports = OrderBy;