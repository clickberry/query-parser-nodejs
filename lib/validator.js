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
}

module.exports = Validator;