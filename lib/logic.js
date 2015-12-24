exports.parse = function (str, callback) {
    var orArr = str.split(' or ');
    var obj = {};
    if (orArr.length > 1) {
        obj.or = [];
        orArr.forEach(function (item) {
            var valArr = item.split(' and ');
            if (valArr.length > 1) {
                var arr = [];
                valArr.forEach(function (exp) {
                    var newExp = callback(exp);
                    arr.push(newExp);
                });
                obj.or.push({and: arr});
            } else {
                var newExp = callback(item);
                obj.or.push(newExp);
            }
        });
    } else {
        var andArr = str.split(' and ');
        if (andArr.length > 1) {
            var arr = [];
            andArr.forEach(function (exp) {
                var newExp = callback(exp);
                arr.push(newExp);
            });
            obj.and = arr;
        } else {
            obj = callback(str);
        }
    }
    return obj;
};
