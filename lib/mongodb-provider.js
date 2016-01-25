exports.parse = function (obj) {
    var result = {};
    if (checkObject(obj.filter)) {
        result.query = getQuery(obj.filter);
    }
    if (checkObject(obj.orderBy)) {
        result.sort = getOrderBy(obj.orderBy);
    }
    if (checkValue(obj.skip)) {
        result.skip = obj.skip.value;
    }
    if (checkValue(obj.top)) {
        result.limit = obj.top.value;
    }

    return result;
};

var operators = {
    lt: '$lt',
    le: '$lte',
    gt: '$gt',
    ge: '$gte',
    ne: '$ne',
    eq: '$eq'
};

var directions = {
    asc: 1,
    desc: -1
};

function checkObject(obj) {
    return obj && Object.keys(obj).length > 0
}

function checkValue(obj) {
    return obj && obj.value;
}

function getOrderBy(orderBy) {
    var obj = {};
    orderBy.forEach(function (item) {
        obj[item.field] = getDirection(item.direction);
    });

    return obj;
}

function getDirection(direction) {
   return directions[direction];
}

function getQuery(filter) {
    var obj = {};
    if (filter.or) {
        obj['$or'] = filter.or.map(function (item) {
            return getQuery(item);
        });
    } else if (filter.and) {
        obj['$and'] = filter.and.map(function (item) {
            return getQuery(item);
        });
    } else {
        obj = getExp(filter);
    }

    return obj;
}

function getExp(exp) {
    var obj = {};
    var objOperator = {};
    var operator = getOperator(exp.operator);

    objOperator[operator] = exp.value;
    obj[exp.field] = objOperator;

    return obj;
}

function getOperator(operator) {
    return operators[operator];
}

