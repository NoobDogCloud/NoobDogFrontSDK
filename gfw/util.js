import _ from "lodash";

export function toObject(v){
    return _.isString(v) ? JSON.parse(v) : v;
}

export function toString(v){
    return _.isObject(v) ? JSON.stringify(v) : v;
}

export function invalidate(v){
    return _.isUndefined(v) || _.isNull(v);
}

export function invalidateAll(v){
    return _.isUndefined(v) || _.isNull(v) || '' || 0 || false;
}
