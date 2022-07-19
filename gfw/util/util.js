import _ from "lodash";

export class util {
    static toObject(v) {
        return _.isString(v) ? JSON.parse(v) : {};
    }

    static toString(v) {
        return _.isObject(v) ? JSON.stringify(v) : "";
    }

    static toBoolean(v) {
        return _.isString(v) ? v === "true" : false;
    }

    static toNumber(v) {
        return _.isString(v) ? Number(v) : 0;
    }

    static invalidate(v) {
        return _.isUndefined(v) || _.isNull(v);
    }

    static invalidateAll(v) {
        return _.isUndefined(v) || _.isNull(v) || _.isEmpty(v) || '' || 0 || false;
    }

    static compress(data) {
        try {
            if( data == null || data == undefined ){
                return "";
            }
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
        catch (e){
            return toString(data);
        }
    }

    static pretty(data) {
        try{
            if( data == null || data == undefined ){
                return "";
            }
            const v = _.isString(data) ? JSON.parse(data) : data;
            return JSON.stringify(v, undefined, 4)
        }
        catch (e){
            return toString(data);
        }
    }
}
