const ParameterMapper = {
    's': "string",
    'i': "int",
    'int': "int",
    'l': "long",
    'long': "long",
    'char': "char",
    'f': "float",
    'float': "float",
    'b': "boolean",
    'boolean': "boolean",
    'short': "short",
    'd': "double",
    'double': "double",
    'j': "JsonObject",
    'json': "JsonObject",
    'ja': "JsonArray",
    'jsonArray': "JsonArray",
    'o': "Object",
}

export function getParameterTypeName(s){
    return ParameterMapper.hasOwnProperty(s) ? ParameterMapper[s] : "string";
}

export function getParameterAll(sArr){
    const arr = sArr.split('\\,')
    let r = [];
    for(let v in arr){
        r.push(getParameterTypeName(v))
    }
    return r.join(",")
}
