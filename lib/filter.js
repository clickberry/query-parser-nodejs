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
                var arr=[];
                valArr.forEach(function(exp){
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
        var andArr = split(str, ' and ');
        if (andArr.length > 1) {
            var arr=[];
            andArr.forEach(function(exp){
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

exports.getLogics = function (str) {
    //var regExpCheck=/\([^()]*\([^()]*\)[^()]*\)/;
    var regExpNoBrackets = /\([^()]*[^()]+\)[^()]*/;
    var regExpWithBrackets = /[^()]+/;

    var notExistBrackets = /^[^()]+$/;
    var existBarackets= /^([^()]*\([^()]+\)[^()]*)+$/;
    var aa=/'.*'/;


    var check = notExistBrackets.test(str) || existBarackets.test(str) || aa.test(str);
    console.log(check);

    if(!check){
        return null;
    }


    //var regExpBracket = /[^'()]+\(([^()]+)\)[^'()]+/g;
    var regExpBracket = /\(([^()]+)\)/g;
    //var regExpBracket = /([^']+|^)\(([^()]+)\)([^']+|$)/g;

    //var regExpBracket = /(([^']+|^)\(([^()]+)\)([^']+|$))/g;
    var filterStr = str;
    var res3;
    var brackets = [];
    while ((res3 = regExpBracket.exec(str)) != null) {
        var exp = res3[1];

        console.log(exp);
        brackets.push(exp);
    }

    brackets.forEach(function (exp, index) {
        filterStr = filterStr.replace('(' + exp + ')', index);
    });

    console.log(brackets);
    //console.log(filterStr);
    var obj = parse(filterStr, brackets);
    return obj;
};

function split(value, splitter) {
    if (typeof(value) == 'string') {
        return value.split(splitter);
    } else if (value instanceof  Array) {
        var arr = [];
        value.forEach(function (item) {
            var valArr = item.split(splitter);
            if (valArr.length > 1) {
                arr = arr.concat(valArr);
            }
        });

        return arr;
    }

    return [];
}

