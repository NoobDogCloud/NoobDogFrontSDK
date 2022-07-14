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

// t = 1 -> json压缩
// t = 2 -> 转义
// t = 4 -> 去除转义
export function compress(t, e) {
    if (1 === t || 3 === t) {
        let n = [];
        let o = 0;
        let r = (e = e.split("\n").join(" ")).length;
        let i = !1;
        for (; o < r; o++) {
            let a = e.charAt(o);
            i && a === i ? "\\" !== e.charAt(o - 1) && (i = !1) : i || '"' !== a && "'" !== a ? i || " " !== a && "\t" !== a || (a = "") : i = a,
                n.push(a)
        }
        e = n.join("")
    }
    2 !== t && 3 !== t || (e = e.replace(/\\/g, "\\\\").replace(/\"/g, '\\"')),
    4 === t && (e = e.replace(/\\\\/g, "\\").replace(/\\\"/g, '"'));
    return e
}
