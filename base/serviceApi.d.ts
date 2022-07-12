import {BaseApi} from "./baseApi";

export declare class ServiceApi {
    static New(config: ServiceApiConfig): BaseApi
}

type ServiceFilter = {
    [key: string]: any
}

export declare type ServiceApiConfig = {
    // 服务名称
    name: string
    // 服务预载头配置
    headers?: { [key: string]: string }
    // 服务所属模型名称
    model: string
    // 向服务推送时的过滤器
    pushHook?: ServiceFilter
    // 从服务获取时的过滤器
    pullHook?: ServiceFilter
}
