function parse(str) {
    var regExpOr = /^|\s[^(]* or [^)]*$|\s/;
    var orArr = str.split(' or ');
    var obj = {};
    if (orArr.length > 1) {
        obj.or = [];
        orArr.forEach(function (item) {
            var valArr = item.split(' and ');
            if (valArr.length > 1) {
                obj.or.push({and: valArr});
            } else {
                obj.or.push(item);
            }
        });
    } else {
        var andArr = split(str, ' and ');
        if (andArr.length > 1) {
            obj.and = andArr;
        } else {
            obj.exp = str
        }
    }
    return obj;
}

exports.getLogics = function (str) {
    var regExp = /\(([^)]+)\)/;
    var matches=regExp.exec(str);
    console.log(matches);

    var obj = parse(str);
    return obj;

    //console.log(expressions);
    //var obj = {};
    //if (orArr.length > 1) {
    //
    //    andArr.forEach(function (item) {
    //        var andArr = str.split(' and ');
    //    });
    //    if (andArr.length > 0) {
    //
    //    } else {
    //        obj.or = orArr;
    //    }
    //} else if (andArr.length > 1) {
    //    obj.and = andArr;
    //}
    //else {
    //    obj.exp = str
    //}
    //
    //return obj;
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

        console.log(arr);
        return arr;
    }

    return [];
}

