function extractExp(exp, brackets) {
    var expression = brackets[exp];
    if (expression) {
        var ee = parse(expression, brackets);
        return ee;
    }

    return exp;
}

function parse(str, brackets) {
    var orArr = str.split(' or ');
    var obj = {};
    if (orArr.length > 1) {
        obj.or = [];
        orArr.forEach(function (item) {
            var valArr = item.split(' and ');
            if (valArr.length > 1) {
                var arr = [];
                valArr.forEach(function (exp) {
                    var newExp = extractExp(exp, brackets);
                    arr.push(newExp);
                });
                obj.or.push({and: arr});
            } else {
                var newExp = extractExp(item, brackets);
                obj.or.push(newExp);
            }
        });
    } else {
        var andArr = str.split(' and ');
        if (andArr.length > 1) {
            var arr = [];
            andArr.forEach(function (exp) {
                var newExp = extractExp(exp, brackets);
                arr.push(newExp);
            });
            obj.and = arr;
        } else {
            obj = extractExp(str, brackets);
        }
    }
    return obj;
}

exports.getLogics = function (str, callback) {
    var notExistBrackets = /^[^()]+$/;
    var existBarackets = /^([^()]*\([^()]+\)[^()]*)+$/;

    var check = notExistBrackets.test(str) || existBarackets.test(str);

    if (!check) {
        return callback(new Error('Incorrect filter format.'));
    }

    var regExpBracket = /\(([^()]+)\)/g;

    var filterStr = str;
    var res;
    var brackets = [];

    while ((res = regExpBracket.exec(str)) != null) {
        var exp = res[1];
        brackets.push(exp);
    }

    brackets.forEach(function (exp, index) {
        filterStr = filterStr.replace('(' + exp + ')', index);
    });

    var obj = parse(filterStr, brackets);

    callback(null, obj);
};

