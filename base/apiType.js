const ApiTypeMapper = {
    'PublicApi': "公开接口",
    'SessionApi': "登录接口",
    'OauthApi': "授权接口",
    'PrivateApi': "私有接口",
    'CloseApi': "禁用接口",
}

export function getApiTypeName(s){
    return ApiTypeMapper.hasOwnProperty(s) ? ApiTypeMapper[s] : "未知接口";
}
