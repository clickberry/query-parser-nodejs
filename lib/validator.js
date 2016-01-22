function Validator(options) {
    options = options || {};
    this.allow = function (fieldName) {
        if (!options[fieldName] && !options[fieldName].allow) {
            throw new Error('Field \'' + fieldName + '\' is not allowed.')
        }
    };

    this.rename = function (fieldName) {
        return options[fieldName] && options[fieldName].rename || fieldName;
    };

    var hash = {};
    this.duplicate = function (fieldName) {
        if (hash[fieldName]) {
            throw new Error('Field \'' + fieldName + '\' is duplicated.')
        }

        hash[fieldName] = fieldName;
    }
}

module.exports = Validator;