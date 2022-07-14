import _ from "lodash";

export class GscUtil {
    static toObject(v) {
        return _.isString(v) ? JSON.parse(v) : v;
    }

    static toString(v) {
        return _.isObject(v) ? JSON.stringify(v) : v;
    }

    static toBoolean(v) {
        return _.isString(v) ? v === "true" : v;
    }

    static toNumber(v) {
        return _.isString(v) ? Number(v) : v;
    }

    static invalidate(v) {
        return _.isUndefined(v) || _.isNull(v);
    }

    static invalidateAll(v) {
        return _.isUndefined(v) || _.isNull(v) || _.isEmpty(v) || '' || 0 || false;
    }

    static compress(data) {
        const v = _.isString(data) ? JSON.parse(data) : data;
        let e = JSON.stringify(v)
        for (var n = [], i = !1, o = 0, r = (e = e.split("\n").join(" ")).length; o < r; o++) {
            var a = e.charAt(o);
            i && a === i ? "\\" !== e.charAt(o - 1) && (i = !1) : i || '"' !== a && "'" !== a ? i || " " !== a && "\t" !== a || (a = "") : i = a,
                n.push(a)
        }
        e = n.join("");
        return e;
    }

    static pretty(data) {
        const v = _.isString(data) ? JSON.parse(data) : data;
        return JSON.stringify(v, undefined, 4)
    }
}
