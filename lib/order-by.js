function OrderBy(orderbyStr, validator) {
    this._orderbyStr = orderbyStr;
    this._validator = validator;
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
    var validator = this._validator;

    fields.forEach(function (item) {
        var matches = item.match(regExp)

        if (!matches) {
            throw new Error('OrderBy incorrect format.');
        }

        var fieldName = matches[1];
        var direction = matches[2];

        validator.allow(fieldName);
        var newFieldName=validator.rename(fieldName);

        obj[newFieldName] = direction || 'asc';
    });

    return this._obj = obj;
};

function validate(obj, options) {

}

module.exports = OrderBy;