import _ from 'lodash'
import { RpcReturn } from '../rpc/response'
import axios from "axios";
import config from "../config/config";
import qs from "qs";
import {createSec} from "../rpc/sec";
import {RpcClient} from "../rpc/rpcClient";
import {InterfaceInfo} from "../service/interfaceInfo";
// 应用上下文对象缓存
const AppContextStore = {}

let DefaultContext = undefined
// 通过 net 访问master服务获得应用描述
const ContextStore = {}

function loadContext (data) {
    return new Promise((resolve, reject) => {
        axios
            .get(config.oauthUrl + '/' + data)
            .then(response => {
                if (response.data !== '') {
                    reject('error data')
                }
                const result = RpcReturn.build(response.data)
                if (!result.status()) {
                    reject('error invoke')
                }
                ContextStore[config.appID] = result.asJson()
                console.log(ContextStore[config.appID])
                resolve('ok')
            })
            .catch(error => {
                reject(error)
            })
    })
}

export function InitContext () {
    const url = window.location.href.split('#')[0]
    const split = url.split('?')
    const query = qs.parse(split[1], { ignoreQueryPrefix: true })
    history.replaceState(null, null, split[0])
    // 获得 Node 发布的加密信息
    if (_.has(query, 'code')) {
        const code = query.code
        if (code) {
            return loadContext(encodeURIComponent(code))
        }
    }
    // 获得 安全网关 发布的加密信息
    if (_.has(query, 'token')) {
        const token = query.token
        if (token) {
            // 初始化安全沙箱上下文,获得公钥
            createSec(token)
        }
    }
    return Promise.resolve('ok')
}

// 应用程序元数据管理
export class Application {
    appId
    interfaceInfo

    constructor (appId) {
        this.appId = appId
        this.interfaceInfo = {}
    }

    // #异步载入app上下文,每个应用必须第一个使用它
    static build (appId = config.appID) {
        if (_.has(AppContextStore, appId)) {
            return AppContextStore[appId]
        }
        const r = new Application(appId)
        AppContextStore[appId] = r
        return r
    }

    getAppID () {
        return this.appId
    }

    async getContext () {
        if (_.has(ContextStore, this.appId)) {
            return ContextStore[this.appId]
        }
        await this.load()
        return await this.getContext()
    }

    static getDefaultContext () {
        if (DefaultContext) {
            return DefaultContext
        }
        DefaultContext = Application.build()
        return DefaultContext
    }

    async load () {
        if (!_.has(ContextStore, this.appId)) {
            if (this.appId === '0') {
                ContextStore[this.appId] = {}
            } else {
                // 通过统一方法获得应用上下文
                const resp = await RpcClient.New(config.framework)
                    .setHeader('appID', 0)
                    .setPath('Context', 'get')
                    .get(`${this.appId}`)
                const appCtx = RpcReturn.build(resp)
                if (!appCtx.status()) {
                    throw new Error(`应用[${this.appId}] ->上下文无效!`)
                }
                ContextStore[this.appId] = appCtx.asJson()
            }
        }
        return this
    }

    // 获得微服务内类接口信息
    async loadClassDesc (baseRpc, serviceName, className) {
        if (_.has(this.interfaceInfo, serviceName + '_' + className)) {
            return this.interfaceInfo[serviceName + '_' + className]
        }
        const resp = await baseRpc.getNet().setHeader('appID', this.appId)
            .setPath(className, '@description')
            .get()
        const info = RpcReturn.build(resp).asJsonArray()
        const data = {}
        _.forEach(info, o => {
            const ifInfo = InterfaceInfo.build(o)
            const item = _.get(data, ifInfo.name, [])
            item.push(ifInfo)
            _.set(data, ifInfo.name, item)
        })
        this.interfaceInfo[serviceName + '_' + className] = data
        return data
    }
}
